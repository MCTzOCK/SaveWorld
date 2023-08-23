/**
 * src/routes/account/update.ts
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
import { authenticator } from "otplib";
import { createHash } from "crypto";
import { isNullOrUndefined } from "util";

export default async function (req: Request, res: Response) {
  if (req.method !== "POST") {
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

  if (!user) {
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

  const { update, totpCode } = req.body;

  if (!update) {
    res.status(400).json({
      status: 400,
      error: "Please provide all required fields",
    });
    return;
  }

  if (!totpCode && pUser.totpSecret && pUser.totpSecret.length > 0) {
    res.status(400).json({
      status: 400,
      error: "Please provide a valid totp code",
    });
    return;
  }

  if (totpCode && pUser.totpSecret && pUser.totpSecret.length > 0) {
    if (
      !authenticator.verify({
        token: totpCode,
        secret: pUser.totpSecret,
      })
    ) {
      res.status(400).json({
        status: 400,
        error: "Please provide a valid totp code",
      });
      return;
    }
  }

  const updatableKeys = ["firstName", "lastName", "password", "totpActive"];

  let totpSecret = "";

  for (const key of Object.keys(update)) {
    if (!updatableKeys.includes(key)) {
      res.status(400).json({
        status: 400,
        error: "Please provide a valid key",
      });
      return;
    }

    if (key === "password") {
      user.password = createHash("sha512").update(update[key]).digest("hex");
    } else if (key === "totpActive") {
      if (update[key]) {
        user.totpSecret = authenticator.generateSecret();
        totpSecret = user.totpSecret;
      } else {
        user.totpSecret = "";
      }
    } else {
      user[key] = update[key];
    }
  }

  await user.save();

  res.status(200).json({
    status: 200,
    message: "Account updated successfully",
    totpSecret: totpSecret.length > 0 ? totpSecret : undefined,
  });
}
