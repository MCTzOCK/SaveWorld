/**
 * src/routes/account/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.08.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../util/isAuthenticated";
import { createHash } from "node:crypto";
import { authenticator } from "otplib";
import { prisma } from "../../db";

export default async function (req: Request, res: Response) {
  if (req.method !== "POST") throw new Error("Method not allowed");

  const { auth, user } = await isAuthenticated(req, res);

  if (!auth) {
    throw new Error("Not authenticated");
  }

  const { update, totpCode } = req.body;

  if (!update) {
    throw new Error("Missing parameters");
  }

  const updatable = [
    "email",
    "firstName",
    "lastName",
    "password",
    "totpActive",
  ];

  let upd: {
    [key: string]: any;
  } = {};

  let totpS = undefined;

  for (const key of Object.keys(update)) {
    if (!updatable.includes(key)) {
      throw new Error("Invalid parameter");
    }

    if (key === "password") {
      upd[key] = createHash("sha512").update(update[key]).digest("hex");
    } else if (key === "totpActive") {
      if (update[key] === true) {
        if (user.totpSecret) {
          throw new Error("TOTP already active");
        }
        totpS = authenticator.generateSecret();
        upd["totpSecret"] = totpS;
      } else {
        if (user.totpSecret) {
          if (!authenticator.check(totpCode, user.totpSecret)) {
            throw new Error("TOTP Code incorrect");
          }
          upd["totpSecret"] = null;
        }
      }
    } else {
      upd[key] = update[key];
    }
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: upd,
  });

  res.status(200).json({
    status: 200,
    message: "User updated",
    totpSecret: totpS,
  });
}
