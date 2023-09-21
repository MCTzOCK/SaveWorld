/**
 * backend/src/routes/lifestyle/my/submit.ts
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

    const { goals } = req.body;

    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    const lfsummary = await LifestyleSummaryModel.findOne({
      user: user._id,
      date: date,
    });

    if (lfsummary) {
      res.status(400).json({
        error: "Already submitted",
        status: 400,
      });
      return;
    }

    const lfsummaryNew = await LifestyleSummaryModel.create({
      user: user._id,
      date: date,
      goals: goals,
    });

    res.status(200).json({
      status: 200,
      data: lfsummaryNew,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
}
