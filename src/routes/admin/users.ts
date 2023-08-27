/**
 * src/routes/admin/users.ts
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

  let users: any[] = [];

  if (req.query.id) {
    users = await UserModel.find({
      _id: req.query.id,
    });
  } else {
    users = await UserModel.find();
  }

  res.status(200).json({
    users: users,
    status: 200,
    message: "Users attached",
  });
}
