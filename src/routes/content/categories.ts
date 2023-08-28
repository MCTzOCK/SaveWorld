/**
 * backend/src/routes/content/categories.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.08.2023
 *
 */

import { Request, Response } from "express";
import CategoryModel from "../../models/CategoryModel";
import mongoConnect from "../../util/mongo";

export default async function (req: Request, res: Response) {
  try {
    await mongoConnect();

    let filter = {};

    if (req.query.id) {
      filter = {
        _id: req.query.id as any,
      };
    }

    const categories = await CategoryModel.find(filter);

    res.status(200).json(categories).end();
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
