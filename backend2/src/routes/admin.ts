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
import mongoose from "mongoose";
import ArticleModel from "../models/ArticleModel";
import QuizModel from "../models/QuizModel";
import LearningGraphModel from "../models/LearningGraphModel";
import { isAllowed } from "../util/permissions";
import { Perms } from "../util/Perms";
export default async function adminPlugin(app: FastifyInstance, opts: any) {
  app.get(
    "/admin/adp/models",
    {
      config: {
        openapi: {
          description: "Returns all available models",
          summary: "Receive models",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (req, res) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const models = Object.keys(mongoose.models);

      const schemas = {};

      Object.keys(mongoose.models).map((key) => {
        const schema = mongoose.models[key].schema;
        const schemaWithTypes = {};
        for (const key in schema.paths) {
          if (schema.paths.hasOwnProperty(key)) {
            schemaWithTypes[key] = schema.paths[key].instance;
          }
        }
        schemas[key] = schemaWithTypes;
      });

      res.status(200).send({
        models,
        schemas,
        status: 200,
      });
    },
  );
  app.get(
    "/admin/adp/",
    {
      config: {
        openapi: {
          description: "Returns the requested insights",
          summary: "Receive insights",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          filter?: string;
          page?: string;
          model: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { model } = req.query;

      if (mongoose.models[model] === undefined) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      const { filter, page } = req.query;

      const PAGE_SIZE = 10;

      const modelInstance = mongoose.models[model];

      const filterObject = filter ? JSON.parse(decodeURIComponent(filter)) : {};
      const pageObject = page ? Number(page) : 0;

      const entries = await modelInstance
        .find(filterObject)
        .skip(pageObject * PAGE_SIZE)
        .limit(PAGE_SIZE);

      const count = await modelInstance.countDocuments(filterObject);

      res.status(200).send({
        entries,
        count,
        pages: Math.ceil(count / PAGE_SIZE),
      });
    },
  );

  app.post(
    "/admin/adp",
    {
      config: {
        openapi: {
          description: "Updates the requested data",
          summary: "Update Data",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: {
          model: string;
          document_id: string;
          update: any;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { model, document_id, update } = req.body;

      if (mongoose.models[model] === undefined) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      const modelInstance = mongoose.models[model];

      const document = await modelInstance.findById(document_id);

      if (!document) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      for (const key in update) {
        if (update.hasOwnProperty(key)) {
          document[key] = update[key];
          document.markModified(key);
        }
      }

      await document.save();

      res.status(200).send({
        status: 200,
        message: "Updated",
        document: document,
      });
    },
  );

  app.delete(
    "/admin/adp",
    {
      config: {
        openapi: {
          description: "Deletes the requested data",
          summary: "Delete Data",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: {
          model: string;
          document_id: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { model, document_id } = req.body;

      if (mongoose.models[model] === undefined) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      const modelInstance = mongoose.models[model];

      const document = await modelInstance.findById(document_id);

      await document.deleteOne();

      res.status(200).send({
        status: 200,
        message: "Deleted",
      });
    },
  );

  app.get(
    "/admin/adp/plot/pie",
    {
      config: {
        openapi: {
          description: "Returns the requested insights",
          summary: "Receive insights (plot pie)",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          model: string;
          field: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { model, field } = req.query;

      if (mongoose.models[model] === undefined) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      const modelInstance = mongoose.models[model];

      const entries = await modelInstance.find({});

      const result = {};

      entries.forEach((entry) => {
        if (entry[field] in result) {
          result[entry[field]]++;
        } else {
          result[entry[field]] = 1;
        }
      });

      const labels = Object.keys(result);

      const data = [];

      labels.forEach((label) => {
        data.push(result[label]);
      });

      res.status(200).send({
        labels,
        data,
        status: 200,
      });
    },
  );
  app.get(
    "/admin/adp/plot/bar",
    {
      config: {
        openapi: {
          description: "Returns the requested insights",
          summary: "Receive insights (plot bar)",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          model: string;
          field: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { model, field } = req.query;

      if (mongoose.models[model] === undefined) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      const modelInstance = mongoose.models[model];

      const entries = await modelInstance.find({});

      const result = {};

      entries.forEach((entry) => {
        if (entry[field] in result) {
          result[entry[field]]++;
        } else {
          result[entry[field]] = 1;
        }
      });

      const labels = Object.keys(result);

      const data = [];

      labels.forEach((label) => {
        data.push(result[label]);
      });

      res.status(200).send({
        labels: labels.map((key) => {
          const isDate = new Date(key).getTime() > 0;
          if (isDate) {
            return new Date(key).toLocaleString();
          } else {
            return key;
          }
        }),
        data,
        status: 200,
      });
    },
  );

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

  app.post(
    "/admin/content/categories",
    {
      config: {
        openapi: {
          description: "Adds a category",
          summary: "Add category",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_create_category,
    },
    async (
      req: FastifyRequest<{
        Body: {
          name: string;
          description: string;
          image: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { name, description, image } = req.body;

      if (!name || !description || !image) {
        res.status(400).send({
          error: "Missing parameters",
          status: 400,
        });
        return;
      }

      const category = await CategoryModel.create({
        name,
        description,
        image,
      });

      res.status(200).send({
        category,
        message: "Created",
        status: 200,
      });
    },
  );

  app.delete(
    "/admin/content/categories",
    {
      config: {
        openapi: {
          description: "Deletes a category",
          summary: "Delete category",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_delete_category,
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

      const category = await CategoryModel.findById(req.query.id as any);

      if (!category) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      await category.deleteOne();

      res.status(200).send({
        message: "Deleted",
        status: 200,
      });
    },
  );

  app.post(
    "/content/videos/create",
    {
      config: {
        openapi: {
          description: "Creates a video",
          summary: "Create video",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_create_video,
    },
    async (
      req: FastifyRequest<{
        Body: {
          title: string;
          description: string;
          categories: string[];
          youtubeVideoId: string;
          sources: string[];
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { title, description, categories, youtubeVideoId, sources } =
        req.body;

      const video = await VideoModel.create({
        title: title[0],
        description: description[0],
        categories: JSON.parse(categories[0]),
        streamUrl: "https://youtube.com/embed/" + youtubeVideoId[0],
        thumbnailUrl: "/media/file/" + "" + "_thumbnail.png",
        sources: JSON.parse(sources[0]),
      });

      video.streamUrl = "/content/videos/" + video._id + "/stream";
      video.thumbnailUrl = "/media/file/" + video._id + "_thumbnail.png";

      res.status(200).send({
        status: "success",
        message: "Video created successfully.",
        data: {
          video: video,
        },
      });
    },
  );

  app.delete(
    "/admin/content/videos/delete",
    {
      config: {
        openapi: {
          description: "Deletes a video",
          summary: "Delete video",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_delete_video,
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

      const { id } = req.query as {
        id: string;
      };
      if (!id) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const video = await VideoModel.findById(id);

      if (!video) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      await video.deleteOne();

      res.status(200).send({
        message: "Deleted",
        status: 200,
      });
    },
  );

  app.get(
    "/admin/content/videos/list",
    {
      config: {
        openapi: {
          description: "Lists videos",
          summary: "List videos",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_list_videos,
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

      const page = req.query.page ? Number(req.query.page) : 1;

      const videos = await VideoModel.find()
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);

      const count = await VideoModel.countDocuments();

      res.status(200).send({
        videos,
        count,
      });
    },
  );

  app.post(
    "/admin/content/videos/update",
    {
      config: {
        openapi: {
          description: "Updates a video",
          summary: "Update video",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.admin_update_video,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
        Body: {
          title: string;
          description: string;
          categories: string[];
          sources: string[];
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { id } = req.query as {
        id: string;
      };

      const { title, description, categories, sources } = req.body as {
        title: string;
        description: string;
        categories: string[];
        sources: string[];
      };

      const video = await VideoModel.findById(id);

      if (!video) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      video.title = title;
      video.description = description;
      video.categories = categories;
      video.sources = sources;

      await video.save();

      res.status(200).send({
        status: 200,
        message: "Updated video",
      });
    },
  );

  app.post(
    "/admin/content/articles",
    {
      schema: {},
      config: {
        openapi: {
          description: "Creates an article",
          summary: "Create article",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: {
          title: string;
          content: string;
          tags: string[];
          featureImage: string;
          featureImageAuthor: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { title, content, tags, featureImage, featureImageAuthor } =
        req.body;

      if (!title || !content || !tags || !featureImage || !featureImageAuthor) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const articleModel = await ArticleModel.create({
        title,
        content,
        tags,
        featureImage,
        featureImageCPR: featureImageAuthor,
      });

      res.status(200).send({
        status: 200,
        message: "Article created",
        article: articleModel,
      });
    },
  );

  app.delete(
    "/admin/content/articles",
    {
      schema: {},
      config: {
        openapi: {
          description: "Deletes an article",
          summary: "Delete article",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res: FastifyReply,
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

      const article = await ArticleModel.findById(id);

      if (!article) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      await article.deleteOne();

      res.status(200).send({
        status: 200,
        message: "Deleted",
      });
    },
  );

  app.put(
    "/admin/content/articles",
    {
      schema: {},
      config: {
        openapi: {
          description: "Updates an article",
          summary: "Update article",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
        Body: {
          title: string;
          content: string;
          tags: string[];
          featureImage: string;
          featureImageAuthor: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { id } = req.query;
      const { title, content, tags, featureImage, featureImageAuthor } =
        req.body;

      if (
        !id ||
        !title ||
        !content ||
        !tags ||
        !featureImage ||
        !featureImageAuthor
      ) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const article = await ArticleModel.findById(id);

      if (!article) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      article.title = title;
      article.content = content;
      article.tags = tags;
      article.featureImage = featureImage;
      article.featureImageCPR = featureImageAuthor;

      await article.save();

      res.status(200).send({
        status: 200,
        message: "Updated",
      });
    },
  );

  app.post(
    "/admin/content/quizzes",
    {
      schema: {},
      config: {
        openapi: {
          description: "Creates a quiz",
          summary: "Create quiz",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: {
          title: string;
          answers: string[];
          correctAnswer: number;
          featureImage: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { title, answers, correctAnswer, featureImage } = req.body;

      if (!title || !answers || !correctAnswer || !featureImage) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const quiz = await QuizModel.create({
        title,
        answers,
        correctAnswer,
        featureImage,
      });

      res.status(200).send({
        status: 200,
        message: "Quiz created",
        quiz: quiz,
      });
    },
  );

  app.put(
    "/admin/content/quizzes",
    {
      schema: {},
      config: {
        openapi: {
          description: "Updates a quiz",
          summary: "Update quiz",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
        Body: {
          title: string;
          answers: string[];
          correctAnswer: number;
          featureImage: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { id } = req.query;
      const { title, answers, correctAnswer, featureImage } = req.body;

      if (!id || !title || !answers || !correctAnswer || !featureImage) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const quiz = await QuizModel.findById(id);

      if (!quiz) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      quiz.title = title;
      quiz.answers = answers;
      quiz.correctAnswer = correctAnswer;
      quiz.featureImage = featureImage;

      await quiz.save();

      res.status(200).send({
        status: 200,
        message: "Updated",
      });
    },
  );

  app.delete(
    "/admin/content/quizzes",
    {
      schema: {},
      config: {
        openapi: {
          description: "Deletes a quiz",
          summary: "Delete quiz",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res: FastifyReply,
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

      const quiz = await QuizModel.findById(id);

      if (!quiz) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      await quiz.deleteOne();

      res.status(200).send({
        status: 200,
        message: "Deleted",
      });
    },
  );

  app.post(
    "/admin/learning-graph",
    {
      schema: {},
      config: {
        openapi: {
          description: "Creates a learning graph",
          summary: "Create learning graph",
          tags: ["admin"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: {
          category: string;
          json: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await defaultAdminAuth(req, res);

      const { category, json } = req.body;

      const learningGraph = await LearningGraphModel.findOne({
        category,
      });

      if (learningGraph) {
        learningGraph.json = json;
        learningGraph.markModified("json");
        await learningGraph.save();
      } else {
        await LearningGraphModel.create({
          category,
          json,
        });
      }

      res.status(200).send({
        status: 200,
        message: "Created or updated",
      });
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

  if (!isAllowed(user.role, Perms.ADMIN_PANEL)) {
    res.status(401).send({
      error: "Unauthorized",
      status: 401,
    });
    return;
  }

  return { auth, user };
}
