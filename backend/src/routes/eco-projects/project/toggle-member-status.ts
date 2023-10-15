/**
 * backend/src/routes/eco-projects/project/toggle-member-status.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: backend/src/routes/eco-projects/project/toggle-member-status.ts
 *
 */
import { Request, Response } from "express";
import { isAuthenticated } from "../../../util/isAuthenticated";
import EcoProjectModel from "../../../models/EcoProjectModel";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { projectId } = req.query;

    const project = await EcoProjectModel.findById(projectId);

    if (!project) {
      res.status(404).json({ error: "Project not found", status: 404 });
      return;
    }

    if (project.owner.toString() === user._id.toString()) {
      res.status(403).json({
        error: "You can not leave or join your own project",
        status: 403,
      });
      return;
    }

    if (
      project.users.find((u) => u.userId.toString() === user._id.toString())
    ) {
      project.users = project.users.filter(
        (u) => u.userId.toString() !== user._id.toString(),
      );
    } else {
      project.users.push({
        userId: user._id,
        permissions: "MEMBER",
      });
    }

    project.markModified("users");

    await project.save();

    res.status(200).json({
      status: 200,
      memberStatus: project.users.find(
        (u) => u.userId.toString() === user._id.toString(),
      )
        ? 1
        : 0,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
