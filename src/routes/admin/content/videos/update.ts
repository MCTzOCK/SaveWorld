/**
 * backend/src/routes/admin/content/videos/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../../util/isAuthenticated";
import VideoModel from "../../../../models/VideoModel";

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

    if (!auth || user.role !== "admin") {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    const { id } = req.query as {
      id: string;
    };

    if (!id) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    const { title, description, categories } = req.body as {
      title: string;
      description: string;
      categories: string[];
    };

    if (!title || !description || !categories) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    const video = await VideoModel.findById(id);

    if (!video) {
      res.status(404).json({
        error: "Not Found",
        status: 404,
      });
      return;
    }

    video.title = title;
    video.description = description;
    video.categories = categories;

    await video.save();

    res.status(200).json({
      status: 200,
      message: "Updated video",
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
    return;
  }
}
