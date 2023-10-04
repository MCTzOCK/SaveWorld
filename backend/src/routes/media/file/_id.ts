/**
 * backend/src/routes/media/_id.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.08.2023
 *
 */

import { Request, Response } from "express";
import { getMinio } from "../../../util/getMinio";

export default async function (req: Request, res: Response) {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({
          error: "Missing ID",
          status: 400,
        })
        .end();
      return;
    }

    const minio = getMinio();

    const stat = await minio.statObject(
      process.env.MINIO_MEDIA_BUCKET as string,
      req.params.id,
    );
    minio.getObject(
      process.env.MINIO_MEDIA_BUCKET as string,
      req.params.id,
      (err, dataStream) => {
        if (err) {
          res.status(500).json({
            error: err.message,
            status: 500,
          });
          return;
        }

        res.setHeader("Content-Type", stat.metaData["content-type"]);
        res.setHeader(
          "X-Original-Filename",
          stat.metaData["x-original-filename"],
        );

        dataStream.pipe(res);
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
    return;
  }
}
