/**
 * backend/src/routes/content/videos/nextVideos.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import { Request, Response } from "express";
import VideoModel from "../../../models/VideoModel";
import { isAuthenticated } from "../../../util/isAuthenticated";

/**
 * <b style='color: red'>ATTENTION</b>
 * <br />
 * This request will currently only return a random video.
 * In a future version it will return a video based on the watch history of the user.
 * <br />
 * <b style='color: red'>THIS IS ONLY PROTOTYPE AND NOT FINISHED</b>
 * <blockquote style='color: yellow'>
 *     Ben Siebert - 03.09.2023
 * </blockquote>
 */

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    const count = await VideoModel.countDocuments();

    const random = Math.floor(Math.random() * count);

    const video = await VideoModel.findOne().skip(random);

    res.status(200).json({
      video: video,
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      status: 500,
    });
  }
}
