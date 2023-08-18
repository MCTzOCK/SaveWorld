/**
 * src/routes/account/activate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.08.2023
 *
 */
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export default async function (req: Request, res: Response) {
  if (req.method !== "GET") {
    throw new Error("Method not allowed");
  }

  const { token } = req.query;

  if (!token) {
    throw new Error("Missing parameters");
  }

  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst({
    where: {
      activationToken: token.toString(),
    },
  });

  if (!user) {
    throw new Error("Invalid token");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      activationToken: null,
      active: true,
    },
  });

  res.status(200).json({
    status: 200,
    message: "Account activated successfully",
  });
}
