/**
 * backend/src/routes/eco-projects/project/todo/delete-list.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.11.2023
 *
 */
import { Request, Response } from "express";
import { isAuthenticated } from "../../../../util/isAuthenticated";
import EcoProjectModel from "../../../../models/EcoProjectModel";
import EcoProjectToDoListModel from "../../../../models/EcoProjectToDoListModel";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id, listId } = req.query;

    if (!id || !listId) {
      res.status(400).json({ error: "Bad Request", status: 400 });
      return;
    }

    const project = await EcoProjectModel.findById(id);

    if (!project) {
      res.status(404).json({ error: "Not Found", status: 404 });
      return;
    }

    if (
      project.owner.toString() !== user._id.toString() &&
      !["ADMINISTRATOR", "EDITOR"].includes(
        project.users.find((u) => u.userId).permissions || "NONE",
      )
    ) {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    const list = await EcoProjectToDoListModel.findById(listId);

    if (!list) {
      res.status(404).json({
        error: "Not Found",
        status: 404,
      });
      return;
    }

    await list.deleteOne();

    res.status(200).json({
      status: 200,
      message: "List deleted",
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
