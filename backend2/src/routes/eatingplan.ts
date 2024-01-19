/**
 * backend2/src/routes/eatingplan.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */
import { FastifyInstance, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import EatingPlanModel from "../models/EatingPlanModel";
import { FastifySchemas } from "../Schemas";

export default async function eatingplanPlugin(
  app: FastifyInstance,
  opts: any,
) {
  app.get(
    "/eatingplan",
    {
      config: {
        openapi: {
          description: "Receive an eatingplan",
          summary: "Receive an eatingplan",
          tags: ["eatingplan"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eatingplan_get,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          date: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          status: 401,
          message: "Unauthorized",
        });
        return;
      }

      const { date } = req.query;
      const eatingPlan = await EatingPlanModel.findOne({
        user: user._id,
        date: req.query.date,
      }).populate("recipes");

      if (!eatingPlan) {
        res.status(404).send({
          error: "Not found",
        });
        return;
      }

      res.status(200).send({ plan: eatingPlan });
    },
  );

  app.post(
    "/eatingplan",
    {
      config: {
        openapi: {
          description: "Create an eatingplan",
          summary: "Create an eatingplan",
          tags: ["eatingplan"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eatingplan_post,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          date: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          status: 401,
          message: "Unauthorized",
        });
        return;
      }

      const { date } = req.query;

      const existing = await EatingPlanModel.findOne({
        user: user._id,
        date: date,
      });

      if (existing) {
        res.status(400).send({
          plan: existing,
        });
        return;
      }

      const eatingPlan = await EatingPlanModel.create({
        user: user._id,
        date: date,
      });

      res.status(200).send({ plan: eatingPlan });
    },
  );

  app.put(
    "/eatingplan",
    {
      config: {
        openapi: {
          description: "Update an eatingplan",
          summary: "Update an eatingplan",
          tags: ["eatingplan"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eatingplan_put,
    },
    async (
      req: FastifyRequest<{
        Body: {
          date: string;
          recipes: string[];
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          status: 401,
          message: "Unauthorized",
        });
        return;
      }

      const { date, recipes } = req.body;

      const eatingPlan = await EatingPlanModel.findOne({
        user: user._id,
        date: date,
      });

      if (!eatingPlan) {
        res.status(404).send({
          error: "Not found",
        });
        return;
      }

      eatingPlan.recipes = recipes;
      eatingPlan.markModified("recipes");

      await eatingPlan.save();

      res.status(200).send({
        plan: eatingPlan,
      });
    },
  );

  app.delete(
    "/eatingplan",
    {
      config: {
        openapi: {
          description: "Delete an eatingplan",
          summary: "Delete an eatingplan",
          tags: ["eatingplan"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eatingplan_delete,
    },
    async (
      req: FastifyRequest<{
        Body: {
          date: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          status: 401,
          message: "Unauthorized",
        });
        return;
      }
      const { date } = req.body;

      if (!date) {
        res.status(400).send({
          error: "Missing date",
        });
        return;
      }

      await EatingPlanModel.deleteOne({
        user: user._id,
        date: date,
      });

      res.status(200).send({
        success: true,
      });
    },
  );
}
