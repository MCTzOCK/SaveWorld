/**
 * backend/src/routes/admin/content/videos/list.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.09.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../../util/isAuthenticated";
import VideoModel from "../../../../models/VideoModel";

export default async function (req: Request, res: Response) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({
        error: "Method Not Allowed",
        status: 405,
      });
      return;
    }

    const { auth, user } = await isAuthenticated(req, res);

    if (!auth || user.role !== "admin") {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    const PAGE_SIZE = 10;

    const page = req.query.page ? Number(req.query.page) : 1;

    const videos = await VideoModel.find()
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    const count = await VideoModel.countDocuments();

    res.status(200).json({
      videos,
      count,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
