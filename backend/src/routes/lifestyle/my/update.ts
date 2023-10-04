/**
 * backend/src/routes/lifestyle/my/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.09.2023
 *
 */

import { Request, Response } from "express";
import LifestyleModel from "../../../models/LifestyleModel";
import { isAuthenticated } from "../../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      return;
    }

    let lifestyle = await LifestyleModel.findOne({
      user: user._id,
    });

    if (!lifestyle) {
      lifestyle = await LifestyleModel.create({
        user: user._id,
        actions: [],
        goals: [],
      });
    }

    const { actions, goals } = req.body;

    lifestyle.actions = actions;
    lifestyle.goals = goals;

    await lifestyle.save();

    res.status(200).json({
      status: 200,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
