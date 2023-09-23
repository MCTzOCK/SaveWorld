/**
 * backend/src/routes/lifestyle/my/level.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import { Request, Response } from "express";
import LifestyleSummaryModel from "../../../models/LifestyleSummaryModel";
import LifestyleModel from "../../../models/LifestyleModel";
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

    const LAST_X_DAYS = 30;
    const MAX_LEVEL = 10;

    const dates: Date[] = [];

    for (let i = 0; i < LAST_X_DAYS; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setUTCHours(0, 0, 0, 0);
      dates.push(date);
    }

    const summaries = await LifestyleSummaryModel.find({
      user: user._id,
      date: {
        $in: dates,
      },
    });

    const lf = await LifestyleModel.findOne({
      user: user._id,
    });

    let level = 0;

    const totalGoals = lf.goals.length;

    let achievedGoals = 0;
    const g: {
      [key: string]: {
        goal: number;
        actual: number;
      };
    } = {};

    for (const x of lf.goals) {
      let z = 0;
      for (const y of summaries) {
        if (y.goals.find((e) => e.template === x.template)) {
          z += y.goals.find((e) => e.template === x.template).perDay;
        }
      }
      g[x.template] = {
        goal: x.goalPerWeek,
        actual: z,
      };
    }

    for (const x of lf.goals) {
      if (g[x.template].actual <= g[x.template].goal) {
        achievedGoals++;
      }
    }

    const percentage = achievedGoals / totalGoals;

    level = Math.round(percentage * MAX_LEVEL);

    res.status(200).json({
      status: 200,
      level: level,
      totalGoals,
      achievedGoals,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
