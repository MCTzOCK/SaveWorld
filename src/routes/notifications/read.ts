/**
 * backend/src/routes/notifications/read.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import { Request, Response } from "express";
import { isAuthenticated } from "../../util/isAuthenticated";
import PushNotificationModel from "../../models/PushNotificationModel";

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

    const id = req.query.id;

    if (!id) {
      res.status(400).json({
        error: "Bad Request",
        status: 400,
      });
      return;
    }

    const notification = await PushNotificationModel.findOne({
      _id: id,
      user: user._id,
    });

    if (!notification) {
      res.status(404).json({
        error: "Not Found",
        status: 404,
      });
      return;
    }

    notification.read = true;

    await notification.save();

    res.status(200).json({
      status: 200,
      notification: notification,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
