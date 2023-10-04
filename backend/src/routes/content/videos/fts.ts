/**
 * backend/src/routes/content/videos/fts.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import { Request, Response } from "express";
import VideoModel from "../../../models/VideoModel";

export default async function (req: Request, res: Response) {
  try {
    const { q, page } = req.query;

    const vidsMtchTitle = await VideoModel.find({
      title: { $regex: q as string },
    })
      .skip(Math.min(parseInt(page as string) * 10, 0))
      .limit(10);

    const count = await VideoModel.countDocuments({
      title: { $regex: q as string },
    });

    res.status(200).json({
      videos: vidsMtchTitle,
      count,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
