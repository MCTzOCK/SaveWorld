/**
 * backend/src/routes/community/blog/delete.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2023
 *
 */

import { Request, Response } from "express";
import CommunityBlogEntryModel from "../../../models/CommunityBlogEntryModel";
import { isAuthenticated } from "../../../util/isAuthenticated";

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

    const { id } = req.query as { id: string };

    if (!id) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    const entry = await CommunityBlogEntryModel.findById(id);
    if (!entry) {
      res.status(404).json({
        error: "Not Found",
        status: 404,
      });
      return;
    }

    if (entry.username != user.username) {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    await entry.deleteOne();

    res.status(200).json({
      status: 200,
      entry,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
