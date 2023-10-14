/**
 * backend/src/routes/eco-projects/project/homepage/segments.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import { Request, Response } from "express";
import EcoProjectModel from "../../../../models/EcoProjectModel";
import EcoProjectHomepageSegmentModel from "../../../../models/EcoProjectHomepageSegmentModel";
import { isAuthenticated } from "../../../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({
        status: 401,
        error: "Unauthorized",
      });
      return;
    }

    const { id } = req.query;

    const project = await EcoProjectModel.findById(id);

    if (!project) {
      res.status(404).json({
        status: 404,
        error: "Not Found",
      });
      return;
    }

    const segments = await EcoProjectHomepageSegmentModel.find({
      project: project._id,
    });

    res.status(200).json({
      status: 200,
      segments: segments,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
