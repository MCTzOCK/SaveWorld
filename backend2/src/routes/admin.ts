/**
 * backend2/src/routes/admin.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.01.2024
 *
 */
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import UserModel from "../models/UserModel";
import CategoryModel from "../models/CategoryModel";
import ChatMessageModel from "../models/ChatMessageModel";
import ChatModel from "../models/ChatModel";
import CommunityBlogEntryModel from "../models/CommunityBlogEntryModel";
import EcoProjectModel from "../models/EcoProjectModel";
import PushNotificationModel from "../models/PushNotificationModel";
import RecipeModel from "../models/RecipeModel";
import SupportRequestModel from "../models/SupportRequestModel";
import VideoModel from "../models/VideoModel";
import WatchHistoryModel from "../models/WatchHistoryModel";
import { FastifySchemas } from "../Schemas";
import { sendPN } from "../util/sendPN";
import LifestyleTemplateModel from "../models/LifestyleTemplateModel";

export default async function accountPlugin(app: FastifyInstance, opts: any) {
  app.get(
    "/admin/stats",
    {
      config: {
        openapi: {
          description: "Returns the requested stats",
          summary: "Receive stats",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_stats,
    },
    async (req, res) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const usersCount = await UserModel.countDocuments();
      const usersInLastWeek = await UserModel.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      });
      const activeUsersCount = await UserModel.countDocuments({
        active: true,
      });
      const categoryCount = await CategoryModel.countDocuments();
      const chatMessageCount = await ChatMessageModel.countDocuments();
      const chatCount = await ChatModel.countDocuments();
      const communityBlogCount = await CommunityBlogEntryModel.countDocuments();
      const ecoProjectCount = await EcoProjectModel.countDocuments();
      const pushNotificationCount =
        await PushNotificationModel.countDocuments();
      const recipeCount = await RecipeModel.countDocuments();
      const supportCount = await SupportRequestModel.countDocuments();
      const videoCount = await VideoModel.countDocuments();
      const watchHistoryCount = await WatchHistoryModel.countDocuments();

      res.status(200).send({
        status: 200,
        message: "Stats attached",
        stats: {
          users: {
            count: usersCount,
            inLastWeek: usersInLastWeek,
            active: activeUsersCount,
          },
          content: {
            categories: categoryCount,
            videos: videoCount,
            videosWatched: watchHistoryCount,
          },
          recipes: recipeCount,
          supportRequests: supportCount,
          ecoProjects: ecoProjectCount,
          community: {
            blogs: communityBlogCount,
            chats: chatCount,
            chatMessages: chatMessageCount,
          },
          pushNotifications: pushNotificationCount,
        },
      });
    },
  );

  app.get(
    "/admin/users",
    {
      config: {
        openapi: {
          description: "Returns the requested users",
          summary: "Receive users",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_users,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id?: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      let users: any[] = [];

      if (req.query.id) {
        users = await UserModel.find({
          _id: req.query.id,
        });
      } else {
        users = await UserModel.find();
      }

      res.status(200).send({
        users: users,
        status: 200,
        message: "Users attached",
      });
    },
  );

  app.delete(
    "/admin/users/delete",
    {
      config: {
        openapi: {
          description: "Deletes a user",
          summary: "Delete user",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_users_delete,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      let pUser;

      try {
        pUser = await UserModel.findById(req.query.id);
      } catch (e) {
        pUser = await UserModel.findOne({
          username: req.query.id,
        });
      }

      if (!pUser) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      if (pUser.role === "admin") {
        res.status(403).send({
          error: "Forbidden",
          status: 403,
        });
        return;
      }

      await pUser.deleteOne();

      res.status(200).send({
        status: 200,
        success: true,
      });
    },
  );

  app.post(
    "/admin/users/update",
    {
      config: {
        openapi: {
          description: "Updates a user",
          summary: "Update user",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: {},
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
        Body: {
          update: any;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const pUser = await UserModel.findById(req.query.id);

      if (!pUser) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      for (const key in req.body["update"]) {
        if (req.body["update"].hasOwnProperty(key)) {
          pUser[key] = req.body["update"][key];
        }
      }

      await pUser.save();

      res.status(200).send({
        status: 200,
        message: "User updated",
        user: pUser,
      });
    },
  );

  app.get(
    "/admin/support/request",
    {
      config: {
        openapi: {
          description: "Returns the requested support request",
          summary: "Receive support request",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_support_request_get,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { id } = req.query;

      const request = await SupportRequestModel.findById(id);

      if (!request) {
        res.status(404).send({
          error: "Not found",
          status: 404,
        });
        return;
      }

      res.status(200).send({
        status: 200,
        entry: request,
      });
    },
  );

  app.post(
    "/admin/support/request",
    {
      config: {
        openapi: {
          description: "Answers a support request",
          summary: "Answer support request",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_support_request_post,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
        Body: {
          message: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { id } = req.query;

      const request = await SupportRequestModel.findById(id);

      if (!request) {
        res.status(404).send({
          error: "Not found",
          status: 404,
        });
        return;
      }

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

      res.status(200).send({
        status: 200,
        entry: request,
      });
    },
  );

  app.get(
    "/admin/support/requests",
    {
      config: {
        openapi: {
          description: "Returns the requested support requests",
          summary: "Receive support requests",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_support_requests,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          page?: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const PAGE_SIZE = 10;
      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

      const entries = await SupportRequestModel.find({});

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
    "/admin/lifestyle/templates/add",
    {
      config: {
        openapi: {
          description: "Adds a lifestyle template",
          summary: "Add lifestyle template",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_lifestyle_template_add,
    },
    async (
      req: FastifyRequest<{
        Body: {
          name: string;
          goal: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { name, goal } = req.body;

      if (!name || !goal) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const lst = await LifestyleTemplateModel.create({
        name: name,
        goal: goal,
      });

      res.status(200).send({ lst, status: 200 });
    },
  );

  app.delete(
    "/admin/lifestyle/templates/delete",
    {
      config: {
        openapi: {
          description: "Deletes a lifestyle template",
          summary: "Delete lifestyle template",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_lifestyle_template_delete,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { id } = req.query;

      if (!id) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const lst = await LifestyleTemplateModel.findById(id);

      if (!lst) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      await lst.deleteOne();

      res.status(200).send({ message: "Deleted", status: 200 });
    },
  );

  app.post(
    "/admin/lifestyle/templates/update",
    {
      config: {
        openapi: {
          description: "Updates a lifestyle template",
          summary: "Update lifestyle template",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_lifestyle_template_update,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
        Body: {
          name: string;
          goal: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { id } = req.query;

      const { name, goal } = req.body;

      if (!name || !goal || !id) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const lst = await LifestyleTemplateModel.findById(id);

      if (!lst) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      lst.name = name;
      lst.goal = goal;

      await lst.save();

      res.status(200).send({ lst, status: 200 });
    },
  );
}

async function defaultAdminAuth(
  req: FastifyRequest<any>,
  res: FastifyReply<any>,
) {
  const { auth, user } = await isAuth(req);

  if (!auth) {
    res.status(401).send({
      error: "Unauthorized",
      status: 401,
    });
    return;
  }

  if (!user) {
    res.status(401).send({
      error: "Unauthorized",
      status: 401,
    });
    return;
  }

  if (user.role !== "admin") {
    res.status(401).send({
      error: "Unauthorized",
      status: 401,
    });
    return;
  }

  return { auth, user };
}
