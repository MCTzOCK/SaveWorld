/**
 * backend/src/routes/community/blog/like.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2023
 *
 */

import { Request, Response } from "express";
import CommunityBlogEntryModel from "../../../models/CommunityBlogEntryModel";
import { isAuthenticated } from "../../../util/isAuthenticated";
import { getOS } from "../../../util/getOS";
import UserModel from "../../../models/UserModel";

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

    const { id } = req.query as { id: string };

    if (!id) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    const entry = await CommunityBlogEntryModel.findById(id);
    if (!entry) {
      res.status(404).json({
        error: "Not Found",
        status: 404,
      });
      return;
    }

    let sendNotification = false;

    if (entry.likes.includes(user.username)) {
      entry.likes = entry.likes.filter((e) => e != user.username);
    } else {
      entry.likes.push(user.username);
      sendNotification = true;
    }

    await entry.save();

    res.status(200).json({
      status: 200,
      entry,
    });

    if (sendNotification) {
      const os = getOS();
      const notify = os.createNotification({
        contents: {
          en: `@${user.username} hat deinen Beitrag "${entry.title}" geliked!`,
        },
        headings: {
          en: "SaveWorld",
        },
        include_external_user_ids: [
          (await UserModel.findOne({ username: entry.username }))._id,
        ],
        app_id: process.env.ONE_SIGNAL_USER_KEY,
        url: "https://app.saveworld.one/community/r/" + entry._id,
      });
    }
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
