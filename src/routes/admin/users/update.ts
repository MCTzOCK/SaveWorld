/**
 * src/routes/admin/users/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import { Request, Response } from "express";
import { prisma } from "../../../db";
import { isAuthenticated } from "../../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  if (req.method !== "POST") {
    throw new Error("Method not allowed");
  }

  const { auth, user } = await isAuthenticated(req, res);

  if (!auth) {
    throw new Error("Not authenticated");
  }

  if (!user.admin) {
    throw new Error("Not authorized");
  }

  if (!req.query.id) {
    throw new Error("No id given");
  }
  if (!req.body || !req.body.update) {
    throw new Error("No update given");
  }

  await prisma.user.update({
    where: {
      id: req.query.id as string,
    },
    data: {
      ...req.body.update,
    },
  });

  res.status(200).json({
    status: 200,
    message: "User updated",
  });
}
