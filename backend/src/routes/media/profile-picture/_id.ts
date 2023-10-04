/**
 * backend/src/routes/media/profile-picture/_id.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.09.2023
 *
 */

import { Request, Response } from "express";
import UserPreferencesModel from "../../../models/UserPreferencesModel";

export default async function (req: Request, res: Response) {
  try {
    if (req.method !== "GET") {
      res.redirect("/blank-profile-picture-973460_1280.png");
      return;
    }

    const id = req.params.id;

    const userPreferences = await UserPreferencesModel.findOne({ user: id });
    if (!userPreferences) {
      res.redirect("/blank-profile-picture-973460_1280.png");
      return;
    }

    res.redirect(userPreferences.picture);
  } catch (e) {
    res.redirect("/blank-profile-picture-973460_1280.png");
  }
}
