/**
 * src/routes/account/activate.ts
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

export default async function (req: Request, res: Response) {
  if (req.method !== "GET") {
    res
      .status(405)
      .json({
        error: "Method not allowed",
        status: 405,
      })
      .end();
    return;
  }

  try {
    await mongoConnect();

    const { token } = req.query;

    if (!token) {
      res.status(400).json({
        error: "Please provide a token",
        status: 400,
      });
      return;
    }

    const user = await UserModel.findOne({
      activationToken: token,
    });

    if (!user) {
      res.status(400).json({
        error: "Please provide a valid token",
        status: 400,
      });
      return;
    }

    user.active = true;
    user.activationToken = "";

    await user.save();

    res.status(200).json({
      status: 200,
      message: "Account activated successfully",
    });
  } catch (e) {
    res
      .status(500)
      .json({
        error: e.message,
        status: 500,
      })
      .end();
    return;
  }
}
