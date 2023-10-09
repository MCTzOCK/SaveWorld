/**
 * backend/src/routes/content/videos/_id/comment.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.10.23
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../../util/isAuthenticated";
import VideoModel from "../../../../models/VideoModel";
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

    const video = await VideoModel.findById(id);

    if (!video) {
      res.status(404).json({
        error: "Video not found",
        status: 404,
      });
      return;
    }

    const { content } = req.body;

    if (!content) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    const comment = await VideoCommentModel.create({
      user: user._id,
      username: user.username,
      content,
      createdAt: new Date(),
      video: video._id,
    });

    res.status(200).json({
      message: "Created Comment",
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
