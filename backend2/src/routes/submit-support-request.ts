/**
 * backend2/src/routes/submit-support-request.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */
import { FastifyInstance, FastifyRequest } from "fastify";
import SupportRequestModel from "../models/SupportRequestModel";
import UserModel from "../models/UserModel";
import { sendPN } from "../util/sendPN";
import { FastifySchemas } from "../Schemas";

export default async function supportPlugin(app: FastifyInstance, opts: any) {
  app.post(
    "/submit-support-request",
    {
      config: {
        openapi: {
          description: "Creates a new support request (ticket)",
          summary: "Create Support Request",
          tags: ["support"],
          security: [],
        },
      },
      schema: FastifySchemas.submit_support_request,
    },
    async (
      req: FastifyRequest<{
        Body: {
          email: string;
          category: string;
          message: string;
          additionalData?: any;
        };
      }>,
      res,
    ) => {
      const { email, category, message, additionalData } = req.body;

      if (!email || !category) {
        res.status(400).send({
          error: "Missing required fields",
          status: 400,
        });
        return;
      }

      if (
        category.toLowerCase().startsWith("report") &&
        category.toLowerCase() !== "report-bug" &&
        !additionalData
      ) {
        res.status(400).send({
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

      res.status(200).send({
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
    },
  );
}
