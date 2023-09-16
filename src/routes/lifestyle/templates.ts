/**
 * backend/src/routes/lifestyle/templates.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.09.2023
 *
 */

import { Request, Response } from "express";
import LifestyleTemplateModel from "../../models/LifestyleTemplateModel";

export default async function (req: Request, res: Response) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({
        error: "Method not allowed",
        status: 405,
      });
      return;
    }

    const lst = await LifestyleTemplateModel.find({});

    res.status(200).json({ lst });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
