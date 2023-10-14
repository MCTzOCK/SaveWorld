/**
 * backend/src/routes/eco-projects/project/homepage/create-segment.ts
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
    const { title, content, type } = req.body;

    if (!type || !title || !content) {
      res.status(400).json({
        status: 400,
        error: "Bad Request",
      });
      return;
    }

    const project = await EcoProjectModel.findById(id);
    if (!project) {
      res.status(404).json({
        status: 404,
        error: "Not Found",
      });
      return;
    }

    if (
      project.owner.toString() !== user._id.toString() &&
      !["ADMINISTRATOR", "EDITOR"].includes(
        project.users.find((u) => u.userId).permissions || "NONE",
      )
    ) {
      res.status(403).json({
        status: 403,
        error: "Forbidden",
      });
      return;
    }
    const segment = await EcoProjectHomepageSegmentModel.create({
      project: project._id,
      title: title,
      content: content,
      type: type,
    });

    res.status(200).json({
      status: 200,
      segment: segment,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
