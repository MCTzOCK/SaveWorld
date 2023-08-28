/**
 * backend/src/routes/admin/content/categories.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.08.2023
 *
 */

import { Request, Response } from "express";
import CategoryModel from "../../../models/CategoryModel";
import { isAuthenticated } from "../../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res
        .status(401)
        .json({
          error: "Unauthorized",
          status: 401,
        })
        .end();
      return;
    }

    if (user.role !== "admin") {
      res
        .status(403)
        .json({
          error: "Forbidden",
          status: 403,
        })
        .end();
      return;
    }

    if (req.method === "POST") {
      const { name, description, image } = req.body;

      if (!name || !description || !image) {
        res
          .status(400)
          .json({
            error: "Missing parameters",
            status: 400,
          })
          .end();
        return;
      }

      const category = await CategoryModel.create({
        name,
        description,
        image,
      });

      res
        .status(200)
        .json({
          category,
          message: "Created",
          status: 200,
        })
        .end();
    } else if (req.method === "DELETE") {
      if (!req.query.id) {
        res
          .status(400)
          .json({
            error: "Missing parameters",
            status: 400,
          })
          .end();
        return;
      }

      const category = await CategoryModel.findById(req.query.id as any);

      if (!category) {
        res
          .status(404)
          .json({
            error: "Not Found",
            status: 404,
          })
          .end();
        return;
      }

      await category.deleteOne();

      res
        .status(200)
        .json({
          message: "Deleted",
          status: 200,
        })
        .end();
      return;
    } else {
      res
        .status(400)
        .json({
          error: "Method not allowed",
          status: 400,
        })
        .end();
      return;
    }
  } catch (e) {
    res
      .status(500)
      .json({
        error: e.message,
        status: 500,
      })
      .end();
    return;
  }
}
