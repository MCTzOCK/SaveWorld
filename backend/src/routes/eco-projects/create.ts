/**
 * backend/src/routes/eco-projects/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.10.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../util/isAuthenticated";
import EcoProjectModel from "../../models/EcoProjectModel";
import { searchNominatim } from "../../util/nominatimHelpers";

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

    // geoLocation: should be the display_name received from Nominatim
    const { name, startDate, lastsDays, geoLocation } = req.body;

    if (!name || !startDate || !lastsDays || !geoLocation) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

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

    const ecoProject = await EcoProjectModel.create({
      owner: user._id,
      name,
      startDate,
      lastsDays,
      geoLocationType: realGeoLocation.type,
      geoLocationDisplayName: realGeoLocation.display_name,
      geoLocationLat: realGeoLocation.lat,
      geoLocationLon: realGeoLocation.lon,
    });

    res.status(200).json({
      project: ecoProject,
      message: "Success",
      satus: 200,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
