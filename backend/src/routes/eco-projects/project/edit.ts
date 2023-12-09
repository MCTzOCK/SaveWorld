/**
 * backend/src/routes/eco-projects/project/edit.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../util/isAuthenticated";
import EcoProjectModel from "../../../models/EcoProjectModel";
import { searchNominatim } from "../../../util/nominatimHelpers";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({
        error: "Unauthorized",
        status: 401,
      });
      return;
    }

    const { id } = req.query;

    if (!id) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    const { name, startDate, lastsDays, geoLocation } = req.body;

    const project = await EcoProjectModel.findById(id);

    if (!project) {
      res.status(404).json({
        error: "Not Found",
        status: 404,
      });
      return;
    }

    if (
      project.owner.toString() !== user._id.toString() &&
      !["ADMINISTRATOR", "EDITOR"].includes(
        project.users.find((u) => u.userId).permissions || "NONE",
      ) &&
      user.role !== "admin"
    ) {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    project.name = name;
    project.startDate = startDate;
    project.lastsDays = lastsDays;

    const nRes = await searchNominatim(geoLocation);

    let realGeoLocation: {
      type: "custom" | "nominatim";
      display_name: string;
      lat: string;
      lon: string;
    } = {
      type: "custom",
      display_name: geoLocation,
      lat: "",
      lon: "",
    };

    if (nRes.length > 0) {
      const nResExact = nRes.find((n) => n.display_name === geoLocation);

      if (nResExact) {
        realGeoLocation = {
          type: "nominatim",
          display_name: nResExact.display_name,
          lat: nResExact.lat,
          lon: nResExact.lon,
        };
      }
    }

    project.geoLocationType = realGeoLocation.type;
    project.geoLocationDisplayName = realGeoLocation.display_name;
    project.geoLocationLat = realGeoLocation.lat;
    project.geoLocationLon = realGeoLocation.lon;

    await project.save();

    res.status(200).json({
      project: project,
      status: 200,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
