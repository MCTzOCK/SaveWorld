/**
 * backend/src/routes/lifestyle/my.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.09.2023
 *
 */

import { Request, Response } from "express";
import LifestyleModel from "../../models/LifestyleModel";
import { isAuthenticated } from "../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({
        status: 401,
        error: "Unauthorized",
      });
      return;
    }

    let lfsm = await LifestyleModel.findOne({
      user: user._id,
    });

    if (!lfsm) {
      lfsm = await LifestyleModel.create({
        user: user._id,
        actions: [],
        goals: [],
      });
    }

    res.status(200).json({
      status: 200,
      lifestyle: lfsm,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
