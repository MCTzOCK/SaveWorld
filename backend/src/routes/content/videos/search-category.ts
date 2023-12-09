/**
 * backend/src/routes/content/videos/search-category.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.12.2023
 *
 */

import { Request, Response } from "express";
import VideoModel from "../../../models/VideoModel";

export default async function (req: Request, res: Response) {
  try {
    const { q, category } = req.query;

    let videos = await VideoModel.find({
      categories: {
        $in: [category],
      },
    });

    if (q) {
      videos = videos.filter((v) => {
        return v.title.toLowerCase().includes((q as string).toLowerCase());
      });
    }

    res.status(200).json({
      videos,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
