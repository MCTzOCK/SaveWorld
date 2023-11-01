/**
 * backend/src/routes/eco-projects/project/todo/create-item.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: backend/src/routes/eco-projects/project/todo/create-item.ts
 *
 */
import { Request, Response } from "express";
import { isAuthenticated } from "../../../../util/isAuthenticated";
import EcoProjectModel from "../../../../models/EcoProjectModel";
import EcoProjectToDoListItemModel from "../../../../models/EcoProjectToDoListItemModel";
import EcoProjectToDoListModel from "../../../../models/EcoProjectToDoListModel";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id, listId } = req.query;

    if (!listId) {
      res.status(400).json({ error: "Bad Request", status: 400 });
      return;
    }

    const list = await EcoProjectToDoListModel.findById(listId);

    if (!list) {
      res.status(404).json({ error: "Not Found", status: 404 });
      return;
    }

    const { title, description } = req.body;

    const item = await EcoProjectToDoListItemModel.create({
      list: list._id,
      title,
      description,
    });

    res.status(200).json({
      status: 200,
      message: "Item created",
      item: item,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
