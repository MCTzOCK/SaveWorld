/**
 * src/routes/admin/stats.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import { Request, Response } from "express";
import { prisma } from "../../db";
import { isAuthenticated } from "../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  const { auth, user } = await isAuthenticated(req, res);

  if (!auth) {
    throw new Error("Not authenticated");
  }

  if (!user.admin) {
    throw new Error("Not authorized");
  }

  const users = await prisma.user.count();
  const usersInLastWeek = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });
  const usersActive = await prisma.user.count({
    where: {
      active: true,
    },
  });

  const stats = {
    users: {
      count: users,
      inLastWeek: usersInLastWeek,
      active: usersActive,
    },
  };

  res.status(200).json({
    status: 200,
    message: "Stats attached",
    stats: stats,
  });
}
