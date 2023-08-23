/**
 * src/routes/account/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.08.2023
 *
 */

import { Request, Response } from "express";
import mongoConnect from "../../util/mongo";
import { isAuthenticated } from "../../util/isAuthenticated";
import UserModel from "../../models/UserModel";

export default async function (req: Request, res: Response) {
  if (req.method !== "DELETE") {
    res.status(405).json({
      status: 405,
      error: "Method not allowed",
    });
    return;
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

  await pUser.deleteOne();

  res.status(200).json({
    status: 200,
    message: "Account deleted successfully",
  });
}
