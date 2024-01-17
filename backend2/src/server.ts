/**
 * backend2/src/server.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */

import { config } from "dotenv";
config();

import Fastify from "fastify";
import * as path from "path";
import fastifyCors from "@fastify/cors";
import fstatic from "@fastify/static";
import AutoLoad from "@fastify/autoload";

(async () => {
  const fastify = Fastify({
    logger: {
      level: "info",
    },
  });

  fastify.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
  });

  fastify.register(fstatic, {
    root: path.join(__dirname, "..", "public"),
    prefix: "/public/",
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, { prefix: "/" }),
  });

  await fastify.listen(process.env.PORT || 3000, "0.0.0.0");
})();
