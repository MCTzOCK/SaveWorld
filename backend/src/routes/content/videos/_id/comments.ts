/**
 * backend/src/routes/content/videos/_id/comments.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.10.23
 *
 */

import { Request, Response } from "express";
import CommunityBlogEntryModel from "../../../../models/CommunityBlogEntryModel";
import { isAuthenticated } from "../../../../util/isAuthenticated";
import VideoCommentModel from "../../../../models/VideoCommentModel";

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

    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        error: "Please provide an id",
        status: 400,
      });
      return;
    }

    const PAGE_SIZE = 4;
    const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

    const entries = await VideoCommentModel.find({
      video: id.toString(),
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
