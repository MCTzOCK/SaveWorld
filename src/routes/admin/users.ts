/**
 * src/routes/admin/users.ts
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

  let users: any[] = [];

  if (req.query.id) {
    users = await prisma.user.findMany({
      where: {
        id: req.query.id as string,
      },
    });
  } else {
    users = await prisma.user.findMany();
  }

  res.status(200).json({
    status: 200,
    message: "Users attached",
    users,
  });
}
