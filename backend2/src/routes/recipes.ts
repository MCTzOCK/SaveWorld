/**
 * backend2/src/routes/recipes.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.01.2024
 *
 */
import { FastifyInstance, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import RecipeModel from "../models/RecipeModel";
import { FastifySchemas } from "../Schemas";
import { checkRequestPermission } from "../util/permissions";
import { Perms } from "../util/Perms";

export default async function recipePlugin(app: FastifyInstance, opts: any) {
  app.get(
    "/recipes/all",
    {
      config: {
        openapi: {
          description: "Returns the requested recipes (paginated)",
          summary: "Receive recipes",
          tags: ["recipes"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.recipes_all,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          page: number;
          q?: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }
      if (!checkRequestPermission(user.role, Perms.RECIPES_ALL, res)) return;

      const PAGE_SIZE = 5;
      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
      const search = req.query.q ? req.query.q.toString() : "";

      const entries = await RecipeModel.find({
        $or: [{ title: { $regex: search, $options: "i" } }],
      });

      entries.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      res.status(200).send({
        status: 200,
        entries: entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
        pages: Math.ceil(entries.length / PAGE_SIZE),
      });
    },
  );

  app.post(
    "/recipes/create",
    {
      config: {
        openapi: {
          description: "Creates a new recipe",
          summary: "Create recipe",
          tags: ["recipes"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.recipes_create,
    },
    async (
      req: FastifyRequest<{
        Body: {
          title: string;
          steps: string[];
          ingredients: string[];
          image: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (!checkRequestPermission(user.role, Perms.RECIPES_CREATE, res)) return;

      const { title, steps, ingredients, image } = req.body;

      const recipe = await RecipeModel.create({
        created_by: user.username,
        title,
        steps,
        ingredients,
        image,
      });

      res.status(200).send(recipe);
    },
  );

  app.delete(
    "/recipes/delete",
    {
      config: {
        openapi: {
          description: "Deletes a recipe",
          summary: "Delete recipe",
          tags: ["recipes"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.recipes_delete,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (!checkRequestPermission(user.role, Perms.RECIPES_DELETE, res)) return;

      const { id } = req.query;

      const recipe = await RecipeModel.findById(id);

      if (!recipe) {
        res.status(404).send({ error: "Recipe not found", status: 404 });
        return;
      }

      if (user.role !== "admin" && recipe.created_by !== user.username) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      await recipe.deleteOne();

      res.status(200).send(recipe);
    },
  );

  app.get(
    "/recipes/my",
    {
      config: {
        openapi: {
          description: "Returns the requested recipes (paginated)",
          summary: "Receive recipes",
          tags: ["recipes"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.recipes_my,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          page: number;
          q?: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      if (!checkRequestPermission(user.role, Perms.RECIPES_MY, res)) return;

      const PAGE_SIZE = 5;
      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
      const search = req.query.q ? req.query.q.toString() : "";

      const entries = await RecipeModel.find({
        $or: [{ title: { $regex: search, $options: "i" } }],
        created_by: user.username,
      });

      entries.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      res.status(200).send({
        status: 200,
        entries: entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
        pages: Math.ceil(entries.length / PAGE_SIZE),
      });
    },
  );

  app.get(
    "/recipes/receive",
    {
      config: {
        openapi: {
          description: "Returns the requested recipe",
          summary: "Receive recipe",
          tags: ["recipes"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.recipes_receive,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      if (!checkRequestPermission(user.role, Perms.RECIPES_RECEIVE, res))
        return;

      const { id } = req.query;

      const recipe = await RecipeModel.findById(id);

      if (!recipe) {
        res.status(404).send({ error: "Recipe not found" });
        return;
      }

      res.status(200).send({ recipe });
    },
  );

  app.post(
    "/recipes/update",
    {
      config: {
        openapi: {
          description: "Updates a recipe",
          summary: "Update recipe",
          tags: ["recipes"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.recipes_update,
    },
    async (
      req: FastifyRequest<{
        Body: {
          title: string;
          steps: string[];
          ingredients: string[];
          image: string;
        };
        Querystring: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      if (!checkRequestPermission(user.role, Perms.RECIPES_UPDATE, res)) return;

      const { id } = req.query;
      const { title, steps, ingredients, image } = req.body;

      const recipe = await RecipeModel.findOne({
        _id: id,
      });

      if (!recipe) {
        res.status(404).send({ error: "Recipe not found" });
        return;
      }

      if (user.role !== "admin" && recipe.created_by !== user.username) {
        res.status(403).send({ error: "Unauthorized" });
        return;
      }

      recipe.title = title;
      recipe.steps = steps;
      recipe.ingredients = ingredients;
      recipe.image = image;

      await recipe.save();

      res.status(200).send(recipe);
    },
  );
}
