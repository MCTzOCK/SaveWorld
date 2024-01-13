/**
 * backend/src/routes/eco-projects/calendar.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: backend/src/routes/eco-projects/calendar.ts
 *
 */
import { Request, Response } from "express";
import { isAuthenticated } from "../../util/isAuthenticated";
import EcoProjectModel from "../../models/EcoProjectModel";
import { isCodeInRange } from "@onesignal/node-onesignal/dist/util";

export default async function (req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: "Bad Request" });
      return;
    }

    const sDate = new Date(startDate as string);
    const eDate = new Date(endDate as string);

    const projects = await EcoProjectModel.find({
      startDate: {
        $gte: sDate,
        $lte: eDate,
      },
    });

    res.status(200).json({ result: projects });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
