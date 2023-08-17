/**
 * src/routes/account/register.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.08.2023
 *
 */
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as crypto from "node:crypto";
import { getTransport } from "../../util/transport";

export default async function (req: Request, res: Response) {
  if (req.method !== "POST") {
    throw new Error("Method not allowed");
  }

  const { username, password, email, firstName, lastName } = req.body;

  if (!username || !password || !email || !firstName || !lastName) {
    throw new Error("Missing parameters");
  }
  const prisma = new PrismaClient();

  const activationToken = crypto.randomBytes(64).toString("hex");

  const user = await prisma.user.create({
    data: {
      username,
      password: crypto.createHash("sha512").update(password).digest("hex"),
      email,
      firstName,
      lastName,
      activationToken: activationToken,
    },
  });

  const transport = getTransport();

  transport.sendMail({
    from: "Ben Siebert <" + process.env.SMTP_FROM + ">",
    to: email,
    subject: "Please verify your account",
    text: `Please verify your account by clicking on this link: ${
      req.protocol
    }://${req.get("host")}${
      req.get("host").endsWith("/") ? "" : "/"
    }account/verify?token=${activationToken}`,
  });

  if (!user) {
    throw new Error("User not created");
  }

  res.status(200).json({
    status: 200,
    message: "Please check your email to verify your account.",
  });
}
