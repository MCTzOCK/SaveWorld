/**
 * backend/src/routes/community/profile/_username/blogs.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2023
 *
 */

import { Request, Response } from "express";
import CommunityBlogEntryModel from "../../../../models/CommunityBlogEntryModel";
import { isAuthenticated } from "../../../../util/isAuthenticated";

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

    const { username } = req.params;

    if (!username) {
      res.status(400).json({
        error: "Please provide a username",
        status: 400,
      });
      return;
    }

    const PAGE_SIZE = 4;
    const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

    const entries = await CommunityBlogEntryModel.find({
      username: username.toString(),
    });

    let el = entries.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.status(200).json({
      status: 200,
      entries: entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
      pages: Math.ceil(entries.length / PAGE_SIZE),
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "Internal Server Error",
      status: 500,
    });
  }
}
