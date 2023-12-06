/**
 * backend/src/routes/recipes/my.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 6.12.2023
 *
 */
import { Request, Response } from "express";
import RecipeModel from "../../models/RecipeModel";
import { isAuthenticated } from "../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const PAGE_SIZE = 5;
    const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
    const search = req.query.search ? req.query.search.toString() : "";

    const entries = await RecipeModel.find({
      $or: [{ title: { $regex: search, $options: "i" } }],
      created_by: user.username,
    });

    entries.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.status(200).json({
      status: 200,
      entries: entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
      pages: Math.ceil(entries.length / PAGE_SIZE),
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
