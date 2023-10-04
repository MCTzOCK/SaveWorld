/**
 * backend/src/routes/admin/support/requests.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../../util/isAuthenticated";
import SupportRequestModel from "../../../models/SupportRequestModel";
import PushNotificationModel from "../../../models/PushNotificationModel";

export default async function (req: Request, res: Response) {
  try {
    const { auth, user } = await isAuthenticated(req, res);

    if (!auth || user.role !== "admin") {
      res.status(403).json({
        error: "Forbidden",
        status: 403,
      });
      return;
    }

    const PAGE_SIZE = 4;
    const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

    const entries = await SupportRequestModel.find({});

    entries.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.status(200).json({
      status: 200,
      entries: entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
      pages: Math.ceil(entries.length / PAGE_SIZE),
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
