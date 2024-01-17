/**
 * backend2/src/routes/info.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */
import { FastifyInstance } from "fastify";
import { readFileSync } from "fs";

export default async function infoPlugin(app: FastifyInstance, opts: any) {
  app.get("/info", async (req, rep) => {
    const x = JSON.parse(readFileSync("package.json").toString());

    rep.status(200).send({
      status: 200,
      name: x.name,
      version: x.version,
      description: x.description,
      author: x.author,
    });
  });
}
