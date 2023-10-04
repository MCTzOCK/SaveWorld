/**
 * src/routes/account/login.ts
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
import { createHash } from "crypto";
import { authenticator } from "otplib";
import { sign } from "jsonwebtoken";

export default async function (req: Request, res: Response) {
  if (req.method !== "POST") {
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

    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({
          error: "Please provide all required fields",
          status: 400,
        })
        .end();
      return;
    }
    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      res
        .status(400)
        .json({
          error: "Please provide a valid email address",
          status: 400,
        })
        .end();
      return;
    }

    if (!user.active) {
      res
        .status(400)
        .json({
          error: "Please activate your account first",
          status: 400,
        })
        .end();
      return;
    }

    if (user.password !== createHash("sha512").update(password).digest("hex")) {
      res
        .status(400)
        .json({
          error: "Please provide a valid password",
          status: 400,
        })
        .end();
      return;
    }

    if (
      user.totpSecret &&
      !authenticator.check(req.body.totpCode, user.totpSecret)
    ) {
      res
        .status(400)
        .json({
          error: "TOTP Code incorrect",
          status: 400,
        })
        .end();
      return;
    }

    const jsonwebtoken = sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "365d",
      },
    );

    res.status(200).json({
      status: 200,
      message: "Login successful",
      token: jsonwebtoken,
    });
    return;
  } catch (e) {
    res
      .status(500)
      .json({
        error: "Internal server error",
        status: 500,
      })
      .end();
    return;
  }
}
