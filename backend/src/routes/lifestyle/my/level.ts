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
import { getUserEcoLevel } from "../../../util/getUserEcoLevel";

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

    const lvl = await getUserEcoLevel(user);

    res.status(200).json({
      status: 200,
      level: lvl.level,
      totalGoals: lvl.totalGoals,
      achievedGoals: lvl.achievedGoals,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
