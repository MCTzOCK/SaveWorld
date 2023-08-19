/**
 * src/routes/account/login.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.08.2023
 *
 */

import { Request, Response } from "express";
import { createHash } from "node:crypto";
import * as jwt from "jsonwebtoken";
import { authenticator } from "otplib";
import { prisma } from "../../db";

export default async function (req: Request, res: Response) {
  const { email, password, totpCode } = req.body;

  if (!email || !password) {
    throw new Error("Missing parameters");
  }

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user == null) {
    throw new Error("User not found");
  }

  if (!user.active) {
    throw new Error("User not activated");
  }

  if (createHash("sha512").update(password).digest("hex") !== user.password) {
    throw new Error("Password incorrect");
  }

  if (user.totpSecret && !authenticator.check(totpCode, user.totpSecret)) {
    throw new Error("TOTP Code incorrect");
  }

  const jsonwebtoken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "365d",
    },
  );

  res.status(200).json({
    status: 200,
    message: "Login successful",
    token: jsonwebtoken,
  });
}
