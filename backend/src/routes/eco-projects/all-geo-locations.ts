/**
 * backend/src/routes/eco-projects/all-geo-locations.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2023
 *
 */
import { Request, Response } from "express";
import EcoProjectModel from "../../models/EcoProjectModel";
import { isAuthenticated } from "../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const entries = await EcoProjectModel.find({
      startDate: { $gte: new Date() },
    });

    res.status(200).json({
      status: 200,
      entries: entries.map((e) => {
        return [e.geoLocationLat, e.geoLocationLon];
      }),
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
