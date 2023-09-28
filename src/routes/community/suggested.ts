/**
 * backend/src/routes/community/suggested.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.09.2023
 *
 */

import CommunityBlogEntryModel from "../../models/CommunityBlogEntryModel";
import UserPreferencesModel from "../../models/UserPreferencesModel";
import { isAuthenticated } from "../../util/isAuthenticated";
import { Request, Response } from "express";
import UserModel from "../../models/UserModel";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({
        error: "Unauthorized",
        status: 401,
      });
      return;
    }

    const PAGE_SIZE = 4;
    const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

    const entries = await CommunityBlogEntryModel.find({});

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
