/**
 * backend/src/routes/admin/content/videos/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.09.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../../util/isAuthenticated";
import VideoModel from "../../../../models/VideoModel";
import * as formidable from "formidable";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth || user.role !== "admin") {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          status: 500,
        });
        return;
      }

      try {
        const { title, description, categories, youtubeVideoId } = fields;
        if (!title || !description || !categories || !youtubeVideoId) {
          res.status(400).json({
            error: "Bad Request",
            status: 400,
          });
          return;
        }
        const video = await VideoModel.create({
          title: title[0],
          description: description[0],
          categories: JSON.parse(categories[0]),
          streamUrl: "https://youtube.com/embed/" + youtubeVideoId[0],
          thumbnailUrl: "/media/file/" + "" + "_thumbnail.png",
        });

        video.streamUrl = "/content/videos/" + video._id + "/stream";
        video.thumbnailUrl = "/media/file/" + video._id + "_thumbnail.png";

        res.status(200).json({
          status: "success",
          message: "Video created successfully.",
          data: {
            video: video,
          },
        });
      } catch (e) {
        res.status(500).json({
          error: e.message,
          status: 500,
        });
      }
    });
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      status: 500,
    });
  }
}
