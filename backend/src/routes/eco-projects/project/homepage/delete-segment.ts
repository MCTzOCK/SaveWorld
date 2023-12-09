/**
 * backend/src/routes/eco-projects/project/homepage/delete-segment.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: backend/src/routes/eco-projects/project/homepage/delete-segment.ts
 *
 */
import { Request, Response } from "express";
import { isAuthenticated } from "../../../../util/isAuthenticated";
import EcoProjectHomepageSegmentModel from "../../../../models/EcoProjectHomepageSegmentModel";
import EcoProjectModel from "../../../../models/EcoProjectModel";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { projectId, id } = req.query;

    const project = await EcoProjectModel.findById(projectId);
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
      ) &&
      user.role !== "admin"
    ) {
      res.status(403).json({
        status: 403,
        error: "Forbidden",
      });
      return;
    }

    const segment = await EcoProjectHomepageSegmentModel.findById(id);

    if (!segment) {
      res.status(404).json({
        status: 404,
        error: "Not Found",
      });
      return;
    }

    if (segment.project.toString() !== project._id.toString()) {
      res.status(403).json({
        status: 403,
        error: "Forbidden",
      });
      return;
    }

    await segment.deleteOne();

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
