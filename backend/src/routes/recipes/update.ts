/**
 * backend/src/routes/recipes/update.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: backend/src/routes/recipes/update.ts
 *
 */
import { Request, Response } from "express";
import { isAuthenticated } from "../../util/isAuthenticated";
import RecipeModel from "../../models/RecipeModel";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (req.method !== "PUT") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const { id } = req.query;
    const { title, steps, ingredients } = req.body;

    const recipe = await RecipeModel.findOne({
      _id: id,
      created_by: user.username,
    });

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    recipe.title = title;
    recipe.steps = steps;
    recipe.ingredients = ingredients;

    await recipe.save();

    res.status(200).json(recipe);
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
