/**
 * backend/src/routes/eco-projects/project/calendar.ics.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../util/isAuthenticated";
import EcoProjectModel from "../../../models/EcoProjectModel";
import ical, { ICalCalendarMethod } from "ical-generator";

export default async function (req: Request, res: Response) {
  try {
    const { id } = req.query;

    if (!id) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    const project = await EcoProjectModel.findById(id);

    if (!project) {
      res.status(404).json({
        error: "Not Found",
        status: 404,
      });
      return;
    }

    const cal = ical({
      name: "SaveWorld",
      prodId: "//SaveWorld//SaveWorld//DE",
      timezone: "Europe/Berlin",
      method: ICalCalendarMethod.PUBLISH,
      description: "SaveWorld - Projekte",
    });

    cal.createEvent({
      start: new Date(project.startDate),
      end: new Date(
        new Date(project.startDate).setDate(
          new Date(project.startDate).getDate() + project.lastsDays,
        ),
      ),
      location: project.geoLocationDisplayName,
      summary: project.name,
    });

    res.writeHead(200, {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "attachment; filename=calendar.ics",
    });

    res.end(cal.toString());
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
