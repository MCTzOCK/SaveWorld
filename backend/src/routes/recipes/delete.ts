/**
 * backend/src/routes/recipes/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: backend/src/routes/recipes/delete.ts
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

    if (req.method !== "DELETE") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const { id } = req.query;

    const recipe = await RecipeModel.findById(id);

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    if (recipe.created_by !== user.username) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await recipe.deleteOne();

    res.status(200).json(recipe);
  } catch (e) {
    res.status(500).json({
      status: 500,
      error: e.message,
    });
  }
}
