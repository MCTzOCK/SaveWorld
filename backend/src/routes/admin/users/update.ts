/**
 * src/routes/admin/users/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.08.2023
 *
 */

import { Request, Response } from "express";
import UserModel from "../../../models/UserModel";
import { isAuthenticated } from "../../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  if (req.method !== "POST") {
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

  if (user.role !== "admin") {
    res.status(401).json({
      error: "Unauthorized",
      status: 401,
    });
    return;
  }

  if (!req.query.id) {
    res.status(400).json({
      error: "Bad Request",
      status: 400,
    });
    return;
  }

  if (!req.body) {
    res.status(400).json({
      error: "Bad Request",
      status: 400,
    });
    return;
  }

  const pUser = await UserModel.findById(req.query.id);

  if (!pUser) {
    res.status(404).json({
      error: "Not Found",
      status: 404,
    });
    return;
  }

  for (const key in req.body["update"]) {
    if (req.body["update"].hasOwnProperty(key)) {
      pUser[key] = req.body["update"][key];
    }
  }

  await pUser.save();

  res.status(200).json({
    status: 200,
    message: "User updated",
    user: pUser,
  });
}
