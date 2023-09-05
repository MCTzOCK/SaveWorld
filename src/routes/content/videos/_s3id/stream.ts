/**
 * backend/src/routes/content/videos/_s3id/stream.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.09.2023
 *
 */

import { Request, Response } from "express";
import { getMinio } from "../../../../util/getMinio";

export default async function (req: Request, res: Response) {
  try {
    const videoKey = req.params.s3id;

    const minio = await getMinio();

    const stat = await minio.statObject(
      process.env.MINIO_VIDEO_BUCKET as string,
      videoKey,
    );

    if (req.method === "HEAD") {
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Content-Length", stat.size);
      res.status(200);
      res.end();
      return;
    }

    const range = req.headers.range;
    const start = Number((range || "").replace(/bytes=/, "").split("-")[0]);
    const end = Number((range || "").replace(/bytes=/, "").split("-")[1]);

    if (start >= stat.size || end >= stat.size) {
      res.status(200);
      res.end();
    }

    const headers = {
      "Content-Range":
        range !== undefined ? `bytes ${start}-${end}/${stat.size}` : undefined,
      "Accept-Ranges": range !== undefined ? "bytes" : undefined,
      "Content-Length": range !== undefined ? end - start + 1 : undefined,
      "Content-Type": "video/mp4",
    };

    res.statusCode = 206;

    for (const key in headers) {
      if (headers[key] !== undefined) {
        res.setHeader(key, headers[key]);
      }
    }

    minio.getPartialObject(
      process.env.MINIO_VIDEO_BUCKET as string,
      videoKey,
      start,
      end + 1,
      (err, dataStream) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            status: 500,
          });
          return;
        }

        dataStream.pipe(res);
      },
    );
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
