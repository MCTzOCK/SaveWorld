/**
 * backend/src/routes/tracker/updateAction.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.09.2023
 *
 */

import { Request, Response } from "express";
import EcoActionModel from "../../models/EcoActionModel";
import { isAuthenticated } from "../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    if (req.method !== "POST") {
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

    const { id } = req.query;

    if (!id) {
      res.status(400).json({
        status: 400,
        error: "Bad Request",
      });
      return;
    }

    const ecoAction = await EcoActionModel.findById(id);

    if (!ecoAction) {
      res.status(404).json({
        status: 404,
        error: "Not Found",
      });
      return;
    }

    if (ecoAction.user.toString() != user._id.toString()) {
      res.status(401).json({
        status: 401,
        error: "Unauthorized",
      });
      return;
    }

    const { action, description, date } = req.body;

    if (action) {
      ecoAction.action = action;
    }

    if (description) {
      ecoAction.description = description;
    }

    if (date) {
      if (!date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
        res.status(400).json({
          status: 400,
          error: "Bad Request",
        });
        return;
      }
      ecoAction.date = date;
    }

    await ecoAction.save();

    res.status(200).json({
      status: 200,
      data: ecoAction,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: "Internal Server Error",
    });
  }
}
