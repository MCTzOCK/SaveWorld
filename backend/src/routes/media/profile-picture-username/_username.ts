/**
 * backend/src/routes/media/profile-picture-username/_username.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import { Request, Response } from "express";
import UserPreferencesModel from "../../../models/UserPreferencesModel";
import UserModel from "../../../models/UserModel";

export default async function (req: Request, res: Response) {
  try {
    if (req.method !== "GET") {
      res.redirect("/blank-profile-picture-973460_1280.png");
      return;
    }

    const username = req.params.username;

    const userMod = await UserModel.findOne({
      username: username,
    });

    if (!userMod) {
      res.redirect("/blank-profile-picture-973460_1280.png");
      return;
    }
    const userPreferences = await UserPreferencesModel.findOne({
      user: userMod._id,
    });

    if (!userPreferences) {
      res.redirect("/blank-profile-picture-973460_1280.png");
      return;
    }

    res.redirect(userPreferences.picture);
  } catch (e) {
    res.redirect("/blank-profile-picture-973460_1280.png");
  }
}
