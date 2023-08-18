/**
 * src/routes/account/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.08.23
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../util/isAuthenticated";
import { PrismaClient } from "@prisma/client";

export default async function (req: Request, res: Response) {
  if (req.method !== "DELETE") {
    res.status(405).send("Method Not Allowed");
  }

  const { auth, user } = await isAuthenticated(req, res);

  const prisma = new PrismaClient();

  if (!auth || !user) {
    res.status(401).send("Unauthorized");
    return;
  }

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  res.status(200).json({
    status: 200,
    message: "Account deleted successfully",
  });
}
