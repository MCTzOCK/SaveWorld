/**
 * src/routes.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.08.23
 *
 */

import * as fs from "fs";
import * as path from "path";
import { Request, Response } from "express";

export async function getRoutes() {
  const routes = fs.readdirSync(path.join(__dirname, "routes"));
  const routeTable: {
    [key: string]: (req: Request, res: Response) => void | Promise<void>;
  } = {};

  const processRoute = async (directory: string) => {
    if (fs.lstatSync(directory).isDirectory()) {
      fs.readdirSync(directory).forEach((file) => {
        processRoute(path.join(directory, file));
      });
    } else {
      const mod = await import(directory);
      if (mod.default) {
        let d = directory
          .replace(path.join(__dirname, "routes"), "")
          .replace(".ts", "")
          .replace("index", "");

        if (d.endsWith("/")) {
          d = d.substr(0, d.length - 1);
        }

        routeTable[d] = mod.default;
      }
    }
  };

  await processRoute(path.join(__dirname, "routes"));

  return routeTable;
}
