/**
 * backend/src/routes/account/preferences.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.08.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../util/isAuthenticated";
import UserPreferencesModel from "../../models/UserPreferencesModel";

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

    let prefs = await UserPreferencesModel.findOne({ user: user._id });

    if (!prefs) {
      prefs = await UserPreferencesModel.create({
        user: user._id,
        interests: [],
      });
    }

    if (req.method === "GET") {
      res.json({ prefs });
      return;
    } else if (req.method === "POST") {
      const { update } = req.body;

      if (!update) {
        res.status(400).json({
          error: "Please provide an update object",
          status: 400,
        });
        return;
      }

      const disallowed = ["_id", "user", "__v"];

      for (const key in update) {
        if (disallowed.includes(key)) {
          res.status(400).json({
            error: "Please provide a valid update object",
            status: 400,
          });
          return;
        }

        if (key === "community_profile") {
          update[key].followers = prefs[key].followers || [];
        }

        prefs[key] = update[key];
      }

      await prefs.save();
      res.json({ prefs });
      return;
    }
  } catch (e) {
    res
      .status(500)
      .json({
        error: "Internal Server Error",
        status: 500,
      })
      .end();
    return;
  }
}
