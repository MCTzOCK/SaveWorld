/**
 * backend/src/routes/content/videos/nextVideos.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import { Request, Response } from "express";
import VideoModel from "../../../models/VideoModel";
import { isAuthenticated } from "../../../util/isAuthenticated";
import UserPreferencesModel from "../../../models/UserPreferencesModel";
import WatchHistoryModel from "../../../models/WatchHistoryModel";

/**
 * <b style='color: red'>ATTENTION</b>
 * <br />
 * This request will currently only return a random video.
 * In a future version it will return a video based on the watch history of the user.
 * <br />
 * <b style='color: red'>THIS IS ONLY PROTOTYPE AND NOT FINISHED</b>
 * <blockquote style='color: yellow'>
 *     Ben Siebert - 03.09.2023
 * </blockquote>
 */

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    const prefs = await UserPreferencesModel.findOne({
      user: user._id,
    });

    const watchHistory = await WatchHistoryModel.find({
      user: user._id,
    })
      .sort({
        watchedAt: -1,
      })
      .limit(10);

    let watchedInterests = 0;

    for (const v of watchHistory) {
      const video = await VideoModel.findById(v.video);
      if (!video) continue;
      for (const c of video.categories) {
        if (prefs?.interests.includes(c.toString())) {
          watchedInterests++;
        }
      }
    }

    const watchedInterestsPercent = watchedInterests / prefs?.interests.length;

    if (watchedInterestsPercent >= 0.6) {
      const count = await VideoModel.countDocuments();

      const random = Math.floor(Math.random() * count);

      const video = await VideoModel.findOne().skip(random);

      res.status(200).json({
        video: video,
      });
    } else {
      const videos = await VideoModel.find({
        categories: {
          $in: prefs?.interests,
        },
      });

      if (videos.length === 0) {
        const count = await VideoModel.countDocuments();

        const random = Math.floor(Math.random() * count);

        const video = await VideoModel.findOne().skip(random);

        res.status(200).json({
          video: video,
        });
        return;
      }

      const random = Math.floor(Math.random() * videos.length);

      res.status(200).json({
        video: videos[random],
      });
    }
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      status: 500,
    });
  }
}
