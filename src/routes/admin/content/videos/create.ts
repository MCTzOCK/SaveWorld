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
import { getMinio } from "../../../../util/getMinio";
import * as formidable from "formidable";
import { randomBytes } from "crypto";
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
        const { title, description, categories } = fields;
        if (!title || !description || !categories) {
          res.status(400).json({
            error: "Bad Request",
            status: 400,
          });
          return;
        }

        const file = files.video[0] as formidable.File;

        if (!file) {
          res.status(500).json({
            error: "No file",
            status: 500,
          });
          return;
        }

        const mimeType = file.mimetype;
        const fileName = file.originalFilename;

        if (!mimeType.startsWith("video/")) {
          res.status(400).json({
            error: "Please upload a video",
            status: 400,
          });
          return;
        }

        const minio = getMinio();

        let objectName =
          randomBytes(64).toString("hex") +
          "." +
          (fileName as string).split(".").pop();

        await minio.fPutObject(
          process.env.MINIO_VIDEO_BUCKET as string,
          objectName,
          file["filepath"],
          {
            "Content-Type": mimeType,
            "X-ORIGINAL-FILENAME": fileName,
          },
          async (err, etag) => {
            if (err) {
              res.status(500).json({
                error: err.message,
                status: 500,
              });
              return;
            }

            console.log(fields);

            const video = await VideoModel.create({
              title: title[0],
              description: description[0],
              categories: JSON.parse(categories[0]),
              comments: [],
              streamUrl: "/content/videos/" + objectName + "/stream",
              thumbnailUrl: "/content/videos/" + objectName + "/thumbnail",
              s3ObjectName: objectName,
            });

            res.status(200).json({
              status: "success",
              message: "Video created successfully.",
              data: {
                video: video,
              },
            });
          },
        );
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
