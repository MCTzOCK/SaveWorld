/**
 * backend2/src/routes/school.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.03.2024
 *
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import SchoolClassModel from "../models/SchoolClassModel";

export default async function aiPlugin(app: FastifyInstance, opts: any) {
  app.get(
    "/school/classes",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Get all classes",
          description: "Get all classes",
          tags: ["school"],
          security: [
            {
              jwt: [],
            },
          ],
        },
      },
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      const schoolClasses = await SchoolClassModel.find({
        createdBy: user._id,
      });

      res.status(200).send({ schoolClasses });
    },
  );

  app.post(
    "/school/classes",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Create a new class",
          description: "Create a new class",
          tags: ["school"],
          security: [
            {
              jwt: [],
            },
          ],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: {
          name: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      const { name } = req.body;

      if (name === undefined || name === null || name === "") {
        res.status(400).send({
          error: "Name is missing",
          status: 400,
        });
        return;
      }
      const newClass = new SchoolClassModel({
        createdBy: user._id,
        name,
      });

      await newClass.save();

      res.status(200).send({ newClass });
    },
  );

  app.post(
    "/school/classes/:id/name",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Update the name of a class",
          description: "Update the name of a class",
          tags: ["school"],
          security: [
            {
              jwt: [],
            },
          ],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: {
          name: string;
        };
        Params: {
          id: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      const { name } = req.body;
      const { id } = req.params;

      if (name === undefined || name === null || name === "") {
        res.status(400).send({
          error: "Name is missing",
          status: 400,
        });
        return;
      }

      const schoolClass = await SchoolClassModel.findOne({
        _id: id,
        createdBy: user._id,
      });

      if (!schoolClass) {
        res.status(404).send({
          error: "Class not found",
          status: 404,
        });
        return;
      }

      schoolClass.name = name;
      schoolClass.markModified("name");
      await schoolClass.save();

      res.status(200).send({ schoolClass });
    },
  );

  app.delete(
    "/school/classes/:id",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Delete a class",
          description: "Delete a class",
          tags: ["school"],
          security: [
            {
              jwt: [],
            },
          ],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      const { id } = req.params;

      const schoolClass = await SchoolClassModel.findOne({
        _id: id,
        createdBy: user._id,
      });

      if (!schoolClass) {
        res.status(404).send({
          error: "Class not found",
          status: 404,
        });
        return;
      }

      await schoolClass.deleteOne();

      res.status(200).send({ success: true });
    },
  );
}
