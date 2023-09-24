/**
 * backend/src/routes/community/blog/create.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import { Request, Response } from "express";
import CommunityBlogEntryModel from "../../../models/CommunityBlogEntryModel";
import { isAuthenticated } from "../../../util/isAuthenticated";
import UserPreferencesModel from "../../../models/UserPreferencesModel";
import UserModel from "../../../models/UserModel";
import { getOS } from "../../../util/getOS";

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

    let { content, title, tags } = req.body as {
      content: string;
      title: string;
      tags: string[];
    };

    if (!content || !title || !tags) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    content = content.trim();
    title = title.trim();
    tags = tags.map((t) => t.trim());

    const entry = await CommunityBlogEntryModel.create({
      username: user.username,
      title,
      content,
      tags,
      likes: [],
      comments: [],
    });

    res.status(200).json({
      status: 200,
      entry,
    });

    const userPrefs = await UserPreferencesModel.findOne({
      user: user._id,
    });

    let external_uids: string[] = [];

    for (const f of (userPrefs.community_profile as Map<String, any>).get(
      "followers",
    ) as string[]) {
      const uDoc = await UserModel.findOne({
        username: f,
      });

      if (uDoc) {
        external_uids.push(uDoc._id);
      }
    }

    const os = getOS();

    const notify = os.createNotification({
      contents: {
        en: `@${user.username} hat gerade einen Beitrag veröffentlicht!`,
      },
      headings: {
        en: "SaveWorld",
      },
      include_external_user_ids: external_uids,
      app_id: process.env.ONE_SIGNAL_USER_KEY,
      url: "https://app.saveworld.one/community/r/" + entry._id,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
