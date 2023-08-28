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
import { getMediaBucket } from "../../../util/getMediaBucket";
import mongoose from "mongoose";

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

    const bucket = getMediaBucket();

    const file = await bucket
      .find({
        filename: req.params.id,
      })
      .toArray();
    if (file.length === 0) {
      res
        .status(404)
        .json({
          error: "Not Found",
          code: 404,
        })
        .end();
      return;
    }
    res.setHeader("Content-Type", file[0].metadata.contentType);
    bucket
      // @ts-ignore
      .openDownloadStreamByName(req.params.id)
      .pipe(res);
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
