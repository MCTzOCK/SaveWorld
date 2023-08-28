/**
 * backend/src/routes/media/upload.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.08.2023
 *
 */

import { Request, Response } from "express";
import { getMediaBucket } from "../../util/getMediaBucket";
import mongoose from "mongoose";
import * as formidable from "formidable";
import * as fs from "fs";
import { randomBytes } from "crypto";

export default async function (req: Request, res: Response) {
  try {
    if (req.method !== "POST") {
      res
        .status(400)
        .json({
          error: "Method not allowed",
          status: 400,
        })
        .end();
      return;
    }

    const form = new formidable.IncomingForm();

    const bucket = getMediaBucket();

    await new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            status: 500,
          });
          return;
        }

        const file = files.file[0] as formidable.File;

        if (!file) {
          res.status(500).json({
            error: "No file",
            status: 500,
          });
          return;
        }

        console.log(file, file.filepath);

        const content = fs.readFileSync(file["filepath"]);
        const mimeType = file.mimetype;
        const fileName = file.originalFilename;

        const uploadStream = bucket.openUploadStream(
          randomBytes(128).toString("hex") +
            "." +
            (fileName as string).split(".").pop(),
          {
            contentType: mimeType as string,
            metadata: {
              contentType: mimeType as string,
              fileName: fileName as string,
            },
          },
        );

        uploadStream.write(content);

        uploadStream.end();

        await new Promise((resolve0) => {
          uploadStream.on("finish", () => {
            resolve0(true);
          });
        });

        res.end(
          JSON.stringify({
            status: "success",
            message: "File uploaded successfully.",
            data: {
              url: `/media/file/${uploadStream.filename}`,
            },
          }),
        );

        resolve(true);
      });
    });
    return;
  } catch (e) {
    res
      .status(500)
      .json({
        error: e.message,
        status: 500,
      })
      .end();
    return;
  }
}
