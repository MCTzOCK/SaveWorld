/**
 * backend/src/routes/admin/support/request.ts
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
import UserModel from "../../../models/UserModel";
import { sendPN } from "../../../util/sendPN";

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

    const { id } = req.query;

    if (!id) {
      res.status(400).json({
        error: "Missing required fields",
        status: 400,
      });
      return;
    }

    const request = await SupportRequestModel.findById(id);

    if (!request) {
      res.status(404).json({
        error: "Not found",
        status: 404,
      });
      return;
    }

    if (req.method === "GET") {
      res.status(200).json({
        status: 200,
        entry: request,
      });
      return;
    } else if (req.method === "POST") {
      const { message } = req.body;

      if (message) {
        const user = await UserModel.findOne({
          email: request.email,
        });

        if (user) {
          sendPN({
            title: "SaveWorld",
            content: message,
            user_ids: [user._id],
          });
        }
      }

      request.processed = true;

      await request.save();

      res.status(200).json({
        status: 200,
        entry: request,
      });
      return;
    }

    res.status(405).json({
      error: "Method not allowed",
      status: 405,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
