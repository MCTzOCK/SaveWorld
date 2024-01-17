/**
 * backend2/src/routes/notifications.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */
import { FastifyInstance, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import PushNotificationModel from "../models/PushNotificationModel";
import { FastifySchemas } from "../Schemas";

export default async function accountPlugin(app: FastifyInstance, opts: any) {
  app.get(
    "/notifications/my",
    {
      config: {
        openapi: {
          description: "Returns the requested push notifications (paginated)",
          summary: "Receive notifications",
          tags: ["notifications"],
          security: [],
        },
      },
      schema: FastifySchemas.notifications_my,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          page: number;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      const PAGE_SIZE = 10;
      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

      const entries = await PushNotificationModel.find({
        user: user._id,
      });

      entries.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      res.status(200).send({
        status: 200,
        entries: entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
        pages: Math.ceil(entries.length / PAGE_SIZE),
      });
    },
  );

  app.post(
    "/notifications/read",
    {
      config: {
        openapi: {
          description: "Marks a push notification as read",
          summary: "Mark as read",
          tags: ["notifications"],
          security: [],
        },
      },
      schema: FastifySchemas.notifications_read,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      const id = req.query.id;

      if (!id) {
        res.status(400).send({
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
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      notification.read = true;

      await notification.save();

      res.status(200).send({
        status: 200,
        notification: notification,
      });
    },
  );
}
