/**
 * backend/src/routes/eatingplan.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.12.2023
 *
 */

import { Request, Response } from "express";
import EatingPlanModel from "../models/EatingPlanModel";
import { isAuthenticated } from "../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    const { user, auth } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    if (req.method === "GET") {
      if (!req.query.date) {
        res.status(400).json({
          error: "Missing date",
        });
        return;
      }

      const eatingPlan = await EatingPlanModel.findOne({
        user: user._id,
        date: req.query.date,
      }).populate("recipes");

      if (!eatingPlan) {
        res.status(404).json({
          error: "Not found",
        });
        return;
      }

      res.status(200).json({ plan: eatingPlan });
    } else if (req.method === "POST") {
      const { date } = req.query;

      const existing = await EatingPlanModel.findOne({
        user: user._id,
        date: date,
      });

      if (existing) {
        res.status(400).json({
          plan: existing,
        });
        return;
      }

      const eatingPlan = await EatingPlanModel.create({
        user: user._id,
        date: date,
      });

      res.status(200).json({ plan: eatingPlan });
    } else if (req.method === "PUT") {
      const { date, recipes } = req.body;

      if (!date) {
        res.status(400).json({
          error: "Missing date",
        });
        return;
      }

      if (!recipes) {
        res.status(400).json({
          error: "Missing recipes",
        });
        return;
      }

      const eatingPlan = await EatingPlanModel.findOne({
        user: user._id,
        date: date,
      });

      if (!eatingPlan) {
        res.status(404).json({
          error: "Not found",
        });
        return;
      }

      eatingPlan.recipes = recipes;
      eatingPlan.markModified("recipes");

      await eatingPlan.save();

      res.status(200).json({
        plan: eatingPlan,
      });
    } else if (req.method === "DELETE") {
      const { date } = req.body;

      if (!date) {
        res.status(400).json({
          error: "Missing date",
        });
        return;
      }

      await EatingPlanModel.deleteOne({
        user: user._id,
        date: date,
      });

      res.status(200).json({
        success: true,
      });
    } else {
      res.status(405).json({
        error: "Method not allowed",
      });
    }
  } catch (e) {
    res.status(500).json({
      error: e,
    });
  }
}
