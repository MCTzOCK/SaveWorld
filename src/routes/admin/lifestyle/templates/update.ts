/**
 * backend/src/routes/admin/lifestyle/templates/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.09.2023
 *
 */

import { Request, Response } from "express";
import LifestyleTemplateModel from "../../../../models/LifestyleTemplateModel";
import { isAuthenticated } from "../../../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth || user.role !== "admin") {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({
        error: "Method not allowed",
        status: 405,
      });
      return;
    }

    const { id } = req.query;

    const { name, goal } = req.body;

    if (!name || !goal || !id) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    const lst = await LifestyleTemplateModel.findById(id);

    if (!lst) {
      res.status(404).json({
        error: "Not Found",
        status: 404,
      });
      return;
    }

    lst.name = name;
    lst.goal = goal;

    await lst.save();

    res.status(200).json({ lst, status: 200 });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
