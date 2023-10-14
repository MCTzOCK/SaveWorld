/**
 * backend/src/routes/eco-projects/my.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import { Request, Response } from "express";
import EcoProjectModel from "../../models/EcoProjectModel";
import { isAuthenticated } from "../../util/isAuthenticated";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth) {
      res.status(401).json({
        error: "Unauthorized",
        status: 401,
      });
      return;
    }

    const projects = await EcoProjectModel.find({
      $or: [
        { owner: user._id },
        {
          users: {
            $elemMatch: {
              userId: user._id,
            },
          },
        },
      ],
    });

    res.status(200).json({
      projects,
      status: 200,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
