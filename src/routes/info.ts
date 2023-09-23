/**
 * backend/src/routes/info.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import { Request, Response } from "express";
import { readFileSync } from "fs";

export default async function (req: Request, res: Response) {
  const x = JSON.parse(readFileSync("package.json").toString());

  res.status(200).json({
    status: 200,
    name: x.name,
    version: x.version,
    description: x.description,
    author: x.author,
  });
}
