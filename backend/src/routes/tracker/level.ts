/**
 * backend/src/routes/tracker/level.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.09.2023
 *
 */

import { Request, Response } from "express";
import EcoActionModel from "../../models/EcoActionModel";
import { isAuthenticated } from "../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({
        status: 405,
        error: "Method not allowed",
      });
      return;
    }

    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({
        status: 401,
        error: "Unauthorized",
      });
      return;
    }

    const HISTORY = 30;

    const date = new Date();
    const maxPastDate = new Date();
    maxPastDate.setDate(maxPastDate.getDate() - HISTORY);
    let currentPastDate = new Date();

    const dx = (dt: Date) => {
      let year = dt.getFullYear();
      let month =
        dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
      let day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();

      return `${year}-${month}-${day}`;
    };

    let actions: any[] = [];

    while (dx(currentPastDate) != dx(maxPastDate)) {
      const ecoActions = await EcoActionModel.find({
        user: user._id,
        date: dx(currentPastDate),
      });

      actions.push(...ecoActions);

      currentPastDate.setDate(currentPastDate.getDate() - 1);
    }

    const maxLevel = 10;
    const XP_PER_LEVEL = (HISTORY / maxLevel) * 3;

    let XPs = actions.length;

    let level =
      XPs / XP_PER_LEVEL > maxLevel ? maxLevel : Math.round(XPs / XP_PER_LEVEL);

    res.status(200).json({
      status: 200,
      level: level,
      xp: XPs,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: "Internal Server Error",
    });
  }
}
