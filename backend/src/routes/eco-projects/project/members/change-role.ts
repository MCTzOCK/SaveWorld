/**
 * backend/src/routes/eco-projects/project/members/change-role.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.10.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../../util/isAuthenticated";
import EcoProjectModel from "../../../../models/EcoProjectModel";
import UserModel from "../../../../models/UserModel";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { projectId, userId, newRole } = req.query;

    const project = await EcoProjectModel.findById(projectId);

    if (!project) {
      res.status(404).json({ error: "Project not found", status: 404 });
      return;
    }

    if (
      project.owner.toString() !== user._id.toString() &&
      !(
        project.users.find(
          (u) => u.userId.toString() === user._id.toString(),
        ) &&
        (project.users.find((u) => u.userId.toString() === user._id.toString())
          .permissions === "ADMINISTRATOR" ||
          project.users.find((u) => u.userId.toString() === user._id.toString())
            .permissions === "EDITOR")
      )
    ) {
      res.status(403).json({ error: "Forbidden", status: 403 });
      return;
    }

    const usr = project.users.find(
      (u) => u.userId.toString() === userId.toString(),
    );

    if (!usr) {
      res.status(404).json({ error: "User not in project", status: 404 });
      return;
    }

    project.users = project.users.map((u) => {
      if (u.userId.toString() === userId.toString()) {
        u.permissions = newRole.toString();
      }

      return u;
    });

    project.markModified("users");

    await project.save();

    res.status(200).json({
      status: 200,
      message: "User role changed",
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
