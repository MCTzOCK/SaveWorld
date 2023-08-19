/**
 * src/routes/account/verify-token.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.08.23
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../util/isAuthenticated";
import { prisma } from "../../db";

export default async function (req: Request, res: Response) {
  if (req.method !== "GET") {
    throw new Error("Method not allowed");
  }

  const { auth, user } = await isAuthenticated(req, res);

  if (!auth) {
    throw new Error("Not authenticated");
  }

  const pUser = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!pUser || !pUser.active) {
    throw new Error("Not authenticated");
  }

  res.status(200).json({
    status: 200,
    user: {
      id: pUser.id,
      email: pUser.email,
      firstName: pUser.firstName,
      lastName: pUser.lastName,
      totpActive: !!pUser.totpSecret,
      admin: pUser.admin,
      username: pUser.username,
    },
  });
}
