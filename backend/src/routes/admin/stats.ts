/**
 * src/routes/admin/stats.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.08.2023
 *
 */

import { Request, Response } from "express";
import UserModel from "../../models/UserModel";
import { isAuthenticated } from "../../util/isAuthenticated";
import CategoryModel from "../../models/CategoryModel";
import ChatMessageModel from "../../models/ChatMessageModel";
import ChatModel from "../../models/ChatModel";
import CommunityBlogEntryModel from "../../models/CommunityBlogEntryModel";
import EcoProjectModel from "../../models/EcoProjectModel";
import PushNotificationModel from "../../models/PushNotificationModel";
import RecipeModel from "../../models/RecipeModel";
import VideoModel from "../../models/VideoModel";
import WatchHistoryModel from "../../models/WatchHistoryModel";
import SupportRequestModel from "../../models/SupportRequestModel";

export default async function (req: Request, res: Response) {
  if (req.method !== "GET") {
    res.status(405).json({
      error: "Method not allowed",
      status: 405,
    });
    return;
  }

  const { auth, user } = await isAuthenticated(req, res);

  if (!auth) {
    res.status(401).json({
      error: "Unauthorized",
      status: 401,
    });
    return;
  }

  if (!user) {
    res.status(401).json({
      error: "Unauthorized",
      status: 401,
    });
    return;
  }

  if (user.role !== "admin") {
    res.status(401).json({
      error: "Unauthorized",
      status: 401,
    });
    return;
  }

  const usersCount = await UserModel.countDocuments();
  const usersInLastWeek = await UserModel.countDocuments({
    createdAt: {
      $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    },
  });
  const activeUsersCount = await UserModel.countDocuments({
    active: true,
  });
  const categoryCount = await CategoryModel.countDocuments();
  const chatMessageCount = await ChatMessageModel.countDocuments();
  const chatCount = await ChatModel.countDocuments();
  const communityBlogCount = await CommunityBlogEntryModel.countDocuments();
  const ecoProjectCount = await EcoProjectModel.countDocuments();
  const pushNotificationCount = await PushNotificationModel.countDocuments();
  const recipeCount = await RecipeModel.countDocuments();
  const supportCount = await SupportRequestModel.countDocuments();
  const videoCount = await VideoModel.countDocuments();
  const watchHistoryCount = await WatchHistoryModel.countDocuments();

  res.status(200).json({
    status: 200,
    message: "Stats attached",
    stats: {
      users: {
        count: usersCount,
        inLastWeek: usersInLastWeek,
        active: activeUsersCount,
      },
      content: {
        categories: categoryCount,
        videos: videoCount,
        videosWatched: watchHistoryCount,
      },
      recipes: recipeCount,
      supportRequests: supportCount,
      ecoProjects: ecoProjectCount,
      community: {
        blogs: communityBlogCount,
        chats: chatCount,
        chatMessages: chatMessageCount,
      },
      pushNotifications: pushNotificationCount,
    },
  });
}
