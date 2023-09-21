/**
 * backend/src/routes/lifestyle/my/_date.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.09.2023
 *
 */

import { Request, Response } from "express";
import LifestyleSummaryModel from "../../../models/LifestyleSummaryModel";
import { isAuthenticated } from "../../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({
        error: "Unauthorized",
        status: 401,
      });
      return;
    }

    const date = new Date(req.params.date);

    date.setUTCHours(0, 0, 0, 0);

    const lfsummary = await LifestyleSummaryModel.findOne({
      user: user._id,
      date: date,
    });

    if (!lfsummary) {
      res.status(404).json({
        error: "Not found",
        status: 404,
      });
      return;
    }

    res.status(200).json({
      status: 200,
      data: lfsummary,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
}
