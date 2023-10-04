/**
 * backend/src/routes/tracker/dates.ts
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

    const ecoActions = await EcoActionModel.find({
      user: user._id,
    });

    let dates: string[] = [];

    for (const action of ecoActions) {
      if (dates.includes(action.date)) continue;
      dates.push(action.date);
    }

    res.status(200).json({
      status: 200,
      data: dates,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: "Internal Server Error",
    });
  }
}
