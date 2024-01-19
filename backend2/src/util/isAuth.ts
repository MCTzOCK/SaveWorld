/**
 * backend2/src/util/isAuth.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */

import * as jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import { FastifyRequest } from "fastify";

export async function isAuth(req: FastifyRequest) {
  let token = req.headers["x-auth"];

  if (!token) {
    return {
      auth: false,
    };
  }

  token = token as string;
  try {
    if (!jwt.verify(token, process.env.JWT_SECRET)) {
      return {
        auth: false,
      };
    }

    const decoded = jwt.decode(token) as { id: string };

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
