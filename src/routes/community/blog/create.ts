/**
 * backend/src/routes/community/blog/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import { Request, Response } from "express";
import CommunityBlogEntryModel from "../../../models/CommunityBlogEntryModel";
import { isAuthenticated } from "../../../util/isAuthenticated";

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

    let { content, title, tags } = req.body as {
      content: string;
      title: string;
      tags: string[];
    };

    if (!content || !title || !tags) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    content = content.trim();
    title = title.trim();
    tags = tags.map((t) => t.trim());

    const entry = await CommunityBlogEntryModel.create({
      username: user.username,
      title,
      content,
      tags,
      likes: [],
      comments: [],
    });

    res.status(200).json({
      status: 200,
      entry,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
