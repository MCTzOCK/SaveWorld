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

    const range = req.headers.range;
    const start = Number((range || "").replace(/bytes=/, "").split("-")[0]);
    const end = stat.size - 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Type": stat.metaData["content-type"],
    };

    res.writeHead(206, headers);

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
