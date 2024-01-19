/**
 * backend2/src/routes/tracker.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.01.2024
 *
 */
import { FastifyInstance, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import EcoActionModel from "../models/EcoActionModel";
import { FastifySchemas } from "../Schemas";

export default async function trackerPlugin(app: FastifyInstance, opts: any) {
  app.all(
    "/tracker/*",
    {
      config: {
        openapi: {
          description: "Tracker API",
          summary: "Tracker API (deprecated)",
          tags: ["tracker"],
          security: [{ jwt: [] }],
        },
      },
      schema: {},
    },
    async (req, res) => {
      res.status(400).send({
        error:
          "This legacy Tracker API is deprecated. Please use the new lifestyle API.",
        status: 400,
      });
    },
  );
}
