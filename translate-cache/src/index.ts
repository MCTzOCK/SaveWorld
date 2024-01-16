/**
 * translate-cache/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.01.2024
 *
 */

import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import * as process from "process";
import { createHash } from "crypto";
import { getRedisClient } from "./redis";
import { translateOnlineV2 } from "./translate";

(async () => {
  const redis = await getRedisClient();

  const fastify = Fastify({
    logger: true,
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
  });
  fastify.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
  });

  fastify.all("/", async (req, res) => {
    res.status(404);
    res.send({
      error: "Not an endpoint",
    });
  });

  fastify.post("/translate", async (req, res) => {
    try {
      const body = req.body as {
        text: string;
        to: string;
      };

      if (!body.text || !body.to) {
        res.status(400);
        res.send({
          error: "Bad Request",
        });
        return;
      }

      const text = body.text;
      const to = body.to;

      const textHash =
        to + "_" + createHash("sha256").update(text).digest("hex");

      if (await redis.exists(textHash)) {
        res.status(200);
        res.send({
          text: await redis.get(textHash),
        });
      } else {
        const translated = await translateOnlineV2({
          text: text,
          to: to,
        });

        await redis.set(textHash, translated);

        res.status(200);
        res.send({
          text: translated,
        });
      }
    } catch (e) {
      res.status(500);
      res.send({
        error: "Internal Server Error",
        rawError: e,
      });
    }
  });

  fastify.listen(3000, "0.0.0.0", (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening on ${address}`);
  });
})();
