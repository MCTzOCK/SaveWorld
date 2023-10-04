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

  res.status(200).json({
    status: 200,
    message: "Stats attached",
    stats: {
      users: {
        count: usersCount,
        inLastWeek: usersInLastWeek,
        active: activeUsersCount,
      },
    },
  });
}
