/**
 * backend/src/routes/community/search.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.09.2023
 *
 */

import CommunityBlogEntryModel from "../../models/CommunityBlogEntryModel";
import UserPreferencesModel from "../../models/UserPreferencesModel";
import { isAuthenticated } from "../../util/isAuthenticated";
import { Request, Response } from "express";
import UserModel from "../../models/UserModel";

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

    // posts or profiles
    const type = req.query.type ? req.query.type.toString() : "posts";

    const PAGE_SIZE = 4;

    let entries: any[] = [];

    switch (type) {
      case "posts":
        const posts = await CommunityBlogEntryModel.find({
          $or: [
            { title: { $regex: req.query.q.toString(), $options: "i" } },
            { content: { $regex: req.query.q.toString(), $options: "i" } },
          ],
        });
        entries = posts.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        break;
      case "profiles":
        const profiles = await UserPreferencesModel.find({
          $or: [
            {
              "community_profile.displayName": {
                $regex: req.query.q.toString(),
                $options: "i",
              },
            },
            {
              "community_profile.biography": {
                $regex: req.query.q.toString(),
                $options: "i",
              },
            },
            {
              "community_profile.location": {
                $regex: req.query.q.toString(),
                $options: "i",
              },
            },
          ],
        });

        for (const p of profiles) {
          let x = p.community_profile as Map<String, any>;

          const userDoc = await UserModel.findById(p.user);

          if (!userDoc) {
            continue;
          }

          entries.push({
            username: userDoc.username,
            displayName: x.get("displayName"),
            biography: x.get("biography"),
            location: x.get("location"),
          });
        }

        break;
      default:
        res.status(400).json({
          error: "Bad Request",
          status: 400,
        });
    }

    const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

    res.status(200).json({
      status: 200,
      entries: entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
      pages: Math.ceil(entries.length / PAGE_SIZE),
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
