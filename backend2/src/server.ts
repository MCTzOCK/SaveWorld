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
import mongoose from "mongoose";
import * as fastifyMultipart from "@fastify/multipart";

(async () => {
  const openapiDocs = await import("fastify-openapi-docs");

  const fastify = Fastify({
    logger: {
      level: "info",
    },
    maxParamLength: 1000,
  });

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
      fastify.log.info("Connected to MongoDB");
    } catch (e) {
      fastify.log.error("Error while connecting to MongoDB");
      fastify.log.error(e);
      process.exit(1);
    }
  }

  fastify.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
  });

  fastify.register(fastifyMultipart.default, {
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
    },
  });

  fastify.register(fstatic, {
    root: path.join(__dirname, "..", "public"),
    prefix: "/public/",
  });

  fastify.register(openapiDocs.default, {
    openapi: {
      openapi: "3.0.3",
      info: {
        title: "SaveWorld API",
        description: "SaveWorld API",
        contact: {
          name: "Ben Siebert",
          email: "hello@ben-siebert.de",
          url: "https://ben-siebert.com",
        },
        version: "2.0.0",
      },
      servers: [
        {
          url: "https://api.saveworld.one",
          description: "Production",
        },
        {
          url: "https://dev.saveworld.one",
          description: "Development",
        },
      ],
      tags: [
        { name: "account", description: "Account related APIs" },
        {
          name: "notifications",
          description: "(Push-)Notifications related APIs",
        },
        {
          name: "lifestyle",
          description: "Lifestyle related APIs",
        },
        {
          name: "content",
          description: "Content related APIs",
        },
        {
          name: "eatingplan",
          description: "Eatingplan related APIs",
        },
        {
          name: "media",
          description: "Media File related APIs",
        },
        {
          name: "support",
          description: "Support System related APIs",
        },
        {
          name: "system",
          description: "System relevant endpoints",
        },
      ],
      components: {
        securitySchemes: {
          jwt: {
            type: "apiKey",
            in: "header",
            name: "X-AUTH",
          },
        },
      },
    },
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, { prefix: "/" }),
  });

  await fastify.listen(process.env.PORT || 3000, "0.0.0.0");
})();
