/**
 * backend/src/routes/submit-support-request.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import { Request, Response } from "express";
import SupportRequestModel from "../models/SupportRequestModel";
import { sendPN } from "../util/sendPN";
import UserModel from "../models/UserModel";

export default async function (req: Request, res: Response) {
  try {
    const { email, category, message, additionalData } = req.body;

    if (!email || !category) {
      res.status(400).json({
        error: "Missing required fields",
        status: 400,
      });
      return;
    }

    if (category.toLowerCase().startsWith("report") && !additionalData) {
      res.status(400).json({
        error: "Missing required fields",
        status: 400,
      });
      return;
    }

    const supportRequest = await SupportRequestModel.create({
      email,
      category,
      message,
      additionalData,
      processed: false,
      createdAt: Date.now(),
    });

    res.status(200).json({
      status: 200,
      message: "Support request created",
    });

    const admin_external_uids = (await UserModel.find({ role: "admin" })).map(
      (u) => u._id,
    );

    await sendPN({
      title: "[ADMIN] Support Request",
      content: `A new support request has been created. Please check the admin panel.`,
      user_ids: admin_external_uids,
      launch_url:
        "https://app.saveworld.one/admin/support-requests/" +
        supportRequest._id,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      status: 500,
    });
  }
}
