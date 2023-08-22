/**
 * src/util/isAuthenticated.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.08.2023
 *
 */
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import mongoConnect from "./mongo";
import UserModel from "../models/UserModel";

export async function isAuthenticated(req: Request, res: Response) {
  let token = req.headers["x-auth"];

  await mongoConnect();
  if (!token) {
    return {
      auth: false,
    };
  }

  token = token as string;

  if (!jwt.verify(token, process.env.JWT_SECRET)) {
    return {
      auth: false,
    };
  }

  const decoded = jwt.decode(token) as { id: string };

  try {
    const user = await UserModel.findById(decoded.id);

    if (!user || !user.active) {
      return {
        auth: false,
      };
    }

    return {
      auth: true,
      user: user,
    };
  } catch (e) {
    return {
      auth: false,
    };
  }
}
