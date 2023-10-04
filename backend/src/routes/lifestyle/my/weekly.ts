/**
 * backend/src/routes/lifestyle/my/weekly.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.09.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../util/isAuthenticated";
import LifestyleSummaryModel from "../../../models/LifestyleSummaryModel";
import LifestyleModel from "../../../models/LifestyleModel";

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

    const lfs = await LifestyleModel.findOne({
      user: user._id,
    });

    function getWeekDates(date: Date): string[] {
      const weekDates: string[] = [];
      const currentDate = new Date(date);

      // Setze den Wochentag auf Montag (1 entspricht Montag)
      currentDate.setDate(currentDate.getDate() - (currentDate.getDay() - 1));
      currentDate.setUTCHours(0, 0, 0, 0);

      // Füge alle Daten der Woche (Montag bis Sonntag) zum Array hinzu
      for (let i = 0; i < 7; i++) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        weekDates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return weekDates;
    }

    let dates: Date[] = [];
    if (req.query.dayInWeek) {
      dates = getWeekDates(new Date(req.query.dayInWeek as string)).map(
        (e) => new Date(e),
      );
    } else {
      dates = getWeekDates(new Date()).map((e) => new Date(e));
    }

    const summaries = await LifestyleSummaryModel.find({
      user: user._id,
      date: {
        $in: dates,
      },
    });

    const g: {
      [key: string]: {
        goal: number;
        actual: number;
      };
    } = {};

    for (const x of lfs.goals) {
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

    res.status(200).json({
      goals: g,
      status: 200,
      startDate: dates[0],
      endDate: dates[dates.length - 1],
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
