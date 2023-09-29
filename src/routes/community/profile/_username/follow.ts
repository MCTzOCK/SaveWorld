/**
 * backend/src/routes/community/profile/_username/follow.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2023
 *
 */

import { Request, Response } from "express";
import UserPreferencesModel from "../../../../models/UserPreferencesModel";
import { isAuthenticated } from "../../../../util/isAuthenticated";
import UserModel from "../../../../models/UserModel";
import { sendPN } from "../../../../util/sendPN";

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

    if (username === user.username) {
      res.status(403).json({
        error: "You can't follow yourself",
        status: 403,
      });
      return;
    }

    const userDoc = await UserModel.findOne({
      username: username,
    });

    if (!userDoc) {
      res.status(404).json({
        error: "User not found",
        status: 404,
      });
      return;
    }

    const pref = await UserPreferencesModel.findOne({
      user: userDoc._id,
    });

    if (!pref) {
      res.status(404).json({
        error: "User not found",
        status: 404,
      });
      return;
    }

    let shouldNotify = false;

    if (
      new Map<String, any>(pref.community_profile)
        .get("followers")
        .includes(user.username)
    ) {
      new Map<String, any>(pref.community_profile)
        .get("followers")
        .splice(
          new Map<String, any>(pref.community_profile)
            .get("followers")
            .indexOf(user.username),
          1,
        );
    } else {
      new Map<String, any>(pref.community_profile)
        .get("followers")
        .push(user.username);
      shouldNotify = true;
    }

    pref.markModified("community_profile");
    await pref.save();

    res.status(200).json({
      status: 200,
    });

    if (shouldNotify) {
      await sendPN({
        title: "SaveWorld",
        content: `@${user.username} folgt dir jetzt!`,
        user_ids: [userDoc._id],
        launch_url: "https://app.saveworld.one/community/u/" + userDoc.username,
      });
    }
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
