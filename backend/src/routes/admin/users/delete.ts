/**
 * backend/src/routes/admin/users/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.08.2023
 *
 */

import { Request, Response } from "express";
import UserModel from "../../../models/UserModel";
import { isAuthenticated } from "../../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  if (req.method !== "DELETE") {
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

  let pUser;

  try {
    pUser = await UserModel.findById(req.query.id);
  } catch (e) {
    pUser = await UserModel.findOne({
      username: req.query.id,
    });
  }

  if (!pUser) {
    res.status(404).json({
      error: "Not Found",
      status: 404,
    });
    return;
  }

  if (pUser.role === "admin") {
    res.status(403).json({
      error: "Forbidden",
      status: 403,
    });
    return;
  }

  await pUser.deleteOne();

  res.status(200).json({
    status: 200,
    success: true,
  });
}
