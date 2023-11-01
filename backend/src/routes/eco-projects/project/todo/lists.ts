/**
 * backend/src/routes/eco-projects/project/todo/lists.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: backend/src/routes/eco-projects/project/todo/lists.ts
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

    const { id } = req.query;

    if (!id) {
      res.status(400).json({ error: "Bad Request", status: 400 });
      return;
    }

    const project = await EcoProjectModel.findById(id);

    if (!project) {
      res.status(404).json({ error: "Not Found", status: 404 });
      return;
    }

    const lists = await EcoProjectToDoListModel.find({
      project: project._id,
    });

    res.status(200).json({
      status: 200,
      message: "Lists fetched",
      lists: lists,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
