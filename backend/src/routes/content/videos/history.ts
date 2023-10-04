/**
 * backend/src/routes/content/videos/history.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../util/isAuthenticated";
import WatchHistoryModel from "../../../models/WatchHistoryModel";
import VideoModel from "../../../models/VideoModel";

export default async function (req: Request, res: Response) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({
        error: "Method not allowed",
        status: 405,
      });
      return;
    }

    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    const { videoId } = req.body as {
      videoId: string;
    };

    if (!videoId) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    const video = await VideoModel.findById(videoId);

    if (!video) {
      res.status(404).json({
        error: "Not Found",
        status: 404,
      });
      return;
    }

    await WatchHistoryModel.create({
      user: user._id,
      video: video._id,
    });

    res.status(200).json({
      status: 200,
      message: "Successfully saved history",
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      status: 500,
    });
  }
}
