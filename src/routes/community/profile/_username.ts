/**
 * backend/src/routes/community/profile/_username.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../util/isAuthenticated";
import UserPreferencesModel from "../../../models/UserPreferencesModel";
import UserModel from "../../../models/UserModel";
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

    const { username } = req.params;

    if (!username) {
      res.status(400).json({
        error: "Please provide a username",
        status: 400,
      });
      return;
    }

    const userDoc = await UserModel.findOne({ username: username.toString() });

    if (!userDoc) {
      res.status(404).json({
        error: "User not found",
        status: 404,
      });
      return;
    }

    const prefs = await UserPreferencesModel.findOne({ user: userDoc._id });

    if (!prefs) {
      res.status(404).json({
        error: "User not found",
        status: 404,
      });
      return;
    }

    let x = prefs.community_profile;

    if (!x) {
      x = {
        banner: "",
        biography: "",
        displayName: "",
        location: "",
        showLevel: false,
      };
    }

    let lvl = 0;

    if (
      (prefs.community_profile as Map<String, any>).get("showLevel") === true
    ) {
      console.log(1);
      lvl = (await getUserEcoLevel(userDoc)).level;
    }

    res.json({
      status: 200,
      profile: x,
      level: "" + JSON.stringify(lvl) + "",
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
