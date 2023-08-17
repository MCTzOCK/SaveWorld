/**
 * src/routes/account/login.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.08.2023
 *
 */

import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

export default async function (req: Request, res: Response) {
  const prisma = new PrismaClient();

  const { email, password, totpCode } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (user == null) {
    throw new Error("User not found");
  }
}
