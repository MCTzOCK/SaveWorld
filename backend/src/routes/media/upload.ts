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
import mongoose from "mongoose";
import * as formidable from "formidable";
import * as fs from "fs";
import { randomBytes } from "crypto";
import { getMinio } from "../../util/getMinio";

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

    await new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            status: 500,
          });
          return;
        }

        try {
          const file = files.file[0] as formidable.File;

          if (!file) {
            res.status(500).json({
              error: "No file",
              status: 500,
            });
            return;
          }

          const mimeType = file.mimetype;
          const fileName = file.originalFilename;

          const minio = getMinio();

          let objectName =
            randomBytes(64).toString("hex") +
            "." +
            (fileName as string).split(".").pop();

          await minio.fPutObject(
            process.env.MINIO_MEDIA_BUCKET as string,
            objectName,
            file["filepath"],
            {
              "Content-Type": mimeType,
              "X-ORIGINAL-FILENAME": fileName,
            },
            (err, etag) => {
              if (err) {
                res.status(500).json({
                  error: err.message,
                  status: 500,
                });
                return;
              }

              res.end(
                JSON.stringify({
                  status: "success",
                  message: "File uploaded successfully.",
                  data: {
                    url: `/media/file/${objectName}`,
                  },
                }),
              );
            },
          );
        } catch (e) {
          res
            .status(500)
            .json({
              error: e.message,
              status: 500,
            })
            .end();
          resolve(true);
          return;
        }
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
