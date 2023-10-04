/**
 * backend/src/routes/content/videos/_id/rate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.09.2023
 *
 */

import { Request, Response } from "express";
import VideoModel from "../../../../models/VideoModel";

export default async function (req: Request, res: Response) {
  try {
    const video = await VideoModel.findById(req.params.id);

    if (!video) {
      res.status(404).json({
        error: "Not Found",
        status: 404,
      });
      return;
    }

    const { rating } = req.body;

    if (!rating) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    video.ratings.push(rating);

    await video.save();

    res.status(200).json({
      status: 200,
      message: "Rating saved",
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
