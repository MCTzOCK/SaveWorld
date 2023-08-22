/**
 * src/routes/account/verify-token.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2023
 *
 */
import { Request, Response } from "express";
import mongoConnect from "../../util/mongo";
import UserModel from "../../models/UserModel";
import { isAuthenticated } from "../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  if (req.method !== "GET") {
    throw new Error("Method not allowed");
  }

  const { auth, user } = await isAuthenticated(req, res);

  if (!auth) {
    res.status(401).json({
      status: 401,
      error: "Unauthorized",
    });
    return;
  }

  const pUser = await UserModel.findById(user.id);

  if (!pUser || !pUser.active) {
    res.status(401).json({
      status: 401,
      error: "Unauthorized",
    });
    return;
  }

  res.status(200).json({
    status: 200,
    user: {
      id: pUser.id,
      email: pUser.email,
      firstName: pUser.firstName,
      lastName: pUser.lastName,
      totpActive: !!pUser.totpSecret,
      role: pUser.role,
      username: pUser.username,
    },
  });
}
