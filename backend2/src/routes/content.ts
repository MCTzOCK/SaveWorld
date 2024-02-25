/**
 * backend2/src/routes/content.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import CategoryModel from "../models/CategoryModel";
import { FastifySchemas } from "../Schemas";
import { isAuth } from "../util/isAuth";
import VideoModel from "../models/VideoModel";
import UserPreferencesModel from "../models/UserPreferencesModel";
import WatchHistoryModel from "../models/WatchHistoryModel";
import VideoCommentModel from "../models/VideoCommentModel";
import ArticleModel from "../models/ArticleModel";

export default async function contentPlugin(app: FastifyInstance, opts: any) {
  app.get(
    "/content/categories",
    {
      config: {
        openapi: {
          description: "Returns the requested categories",
          summary: "Categories",
          tags: ["content"],
          security: [],
        },
      },
      schema: FastifySchemas.content_categories,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id?: string;
        };
      }>,
      res,
    ) => {
      let filter = {};

      if (req.query.id) {
        filter = {
          _id: req.query.id as any,
        };
      }

      const categories = await CategoryModel.find(filter);

      res.status(200).send(categories);
    },
  );

  app.get(
    "/content/videos/suggested",
    {
      config: {
        openapi: {
          description: "Returns a suggested video",
          summary: "Suggested Video",
          tags: ["content"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.videos_suggested,
    },
    async (req: FastifyRequest, res) => {
      const { auth, user } = await isAuth(req);

      const prefs = await UserPreferencesModel.findOne({
        user: user._id,
      });

      const watchHistory = await WatchHistoryModel.find({
        user: user._id,
      })
        .sort({
          watchedAt: -1,
        })
        .limit(10);

      let watchedInterests = 0;

      for (const v of watchHistory) {
        const video = await VideoModel.findById(v.video);
        if (!video) continue;
        for (const c of video.categories) {
          if (prefs?.interests.includes(c.toString())) {
            watchedInterests++;
          }
        }
      }

      const watchedInterestsPercent =
        watchedInterests / prefs?.interests.length;

      if (watchedInterestsPercent >= 0.6) {
        const count = await VideoModel.countDocuments();

        const random = Math.floor(Math.random() * count);

        const video = await VideoModel.findOne().skip(random);

        res.status(200).send({
          video: video,
        });
      } else {
        const videos = await VideoModel.find({
          categories: {
            $in: prefs?.interests,
          },
        });

        if (videos.length === 0) {
          const count = await VideoModel.countDocuments();

          const random = Math.floor(Math.random() * count);

          const video = await VideoModel.findOne().skip(random);

          res.status(200).send({
            video: video,
          });
          return;
        }

        const random = Math.floor(Math.random() * videos.length);

        res.status(200).send({
          video: videos[random],
        });
      }
    },
  );

  app.get(
    "/content/videos/search-category",
    {
      config: {
        openapi: {
          description: "Returns a list of videos",
          summary: "Search Videos (category)",
          tags: ["content"],
          security: [],
        },
      },
      schema: FastifySchemas.videos_search_category,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          q?: string;
          category?: string;
        };
      }>,
      res,
    ) => {
      const { q, category } = req.query;

      let videos = await VideoModel.find({
        categories: {
          $in: [category],
        },
      });

      if (q) {
        videos = videos.filter((v) => {
          return v.title.toLowerCase().includes((q as string).toLowerCase());
        });
      }

      res.status(200).send({
        videos,
      });
    },
  );

  app.post(
    "/content/videos/history",
    {
      config: {
        openapi: {
          description: "Saves a video to the history",
          summary: "Save Video to History",
          tags: ["content"],
          security: [{ jwt: [] }],
        },
      },
      schema: {},
    },
    async (
      req: FastifyRequest<{
        Body: {
          videoId: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(403).send({
          error: "Forbidden",
          status: 403,
        });
        return;
      }

      const { videoId } = req.body as {
        videoId: string;
      };

      if (!videoId) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const video = await VideoModel.findById(videoId);

      if (!video) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      await WatchHistoryModel.create({
        user: user._id,
        video: video._id,
      });

      res.status(200).send({
        status: 200,
        message: "Successfully saved history",
      });
    },
  );

  app.get(
    "/content/videos/fts",
    {
      config: {
        openapi: {
          description: "Returns a list of videos",
          summary: "Search Videos (fts)",
          tags: ["content"],
          security: [],
        },
      },
      schema: FastifySchemas.videos_fts,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          q?: string;
          page?: string;
        };
      }>,
      res,
    ) => {
      const { q, page } = req.query;

      const vidsMtchTitle = await VideoModel.find({
        title: { $regex: q as string },
      })
        .skip(Math.min(parseInt(page as string) * 10, 0))
        .limit(10);

      const count = await VideoModel.countDocuments({
        title: { $regex: q as string },
      });

      res.status(200).send({
        videos: vidsMtchTitle,
        count,
      });
    },
  );

  app.post(
    "/content/videos/:id/comment",
    {
      config: {
        openapi: {
          description: "Creates a comment",
          summary: "Create Comment",
          tags: ["content"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.videos_comment,
    },
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: {
          content: string;
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

      const { id } = req.params;

      const video = await VideoModel.findById(id);

      if (!video) {
        res.status(404).send({
          error: "Video not found",
          status: 404,
        });
        return;
      }

      const { content } = req.body;

      if (!content) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const comment = await VideoCommentModel.create({
        user: user._id,
        username: user.username,
        content,
        createdAt: new Date(),
        video: video._id,
      });

      res.status(200).send({
        message: "Created Comment",
      });
    },
  );

  app.get(
    "/content/videos/:id/comments",
    {
      config: {
        openapi: {
          description: "Returns a list of comments",
          summary: "Get Comments",
          tags: ["content"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.videos_comments,
    },
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
        };
        Querystring: {
          page?: string;
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

      const { id } = req.params;

      if (!id) {
        res.status(400).send({
          error: "Please provide an id",
          status: 400,
        });
        return;
      }

      const PAGE_SIZE = 4;
      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

      const entries = await VideoCommentModel.find({
        video: id.toString(),
      });

      let el = entries.sort((a, b) => {
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

  app.get(
    "/content/videos/:id/metadata",
    {
      config: {
        openapi: {
          description: "Returns the metadata of a video",
          summary: "Get Video Metadata",
          tags: ["content"],
          security: [],
        },
      },
      schema: FastifySchemas.videos_metadata,
    },
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { id } = req.params;

      const video = await VideoModel.findById(id);

      if (!video) {
        res.status(404).send({
          error: "Video not found",
          status: 404,
        });
        return;
      }

      res.status(200).send({
        video,
      });
    },
  );

  app.post(
    "/content/videos/:id/rate",
    {
      config: {
        openapi: {
          description: "Rates a video",
          summary: "Rate Video",
          tags: ["content"],
          security: [],
        },
      },
      schema: FastifySchemas.videos_rate,
    },
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: {
          rating: number;
        };
      }>,
      res,
    ) => {
      const video = await VideoModel.findById(req.params.id);

      if (!video) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      const { rating } = req.body;

      if (!rating) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      video.ratings.push(rating);

      await video.save();

      res.status(200).send({
        status: 200,
        message: "Rating saved",
      });
    },
  );

  app.get(
    "/content/articles",
    {
      schema: {},
      config: {
        openapi: {
          description: "Returns a list of articles",
          summary: "Get Articles",
          tags: ["content"],
          security: [],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          page?: number;
          tag?: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const PAGE_SIZE = 10;
      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
      const articles = await ArticleModel.find({
        tags: {
          $in: req.query.tag ? [req.query.tag] : [],
        },
      })
        .sort({ createdAt: -1 })
        .skip(page * PAGE_SIZE)
        .limit(PAGE_SIZE);

      res.status(200).send({
        status: 200,
        articles,
        pages: Math.ceil((await ArticleModel.countDocuments()) / PAGE_SIZE),
        page,
      });
    },
  );

  app.get(
    "/content/articles/:id",
    {
      schema: {},
      config: {
        openapi: {
          description: "Returns a single article",
          summary: "Get Article",
          tags: ["content"],
          security: [],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      res,
    ) => {
      const article = await ArticleModel.findById(req.params.id);
      res.status(200).send({
        status: 200,
        article,
      });
    },
  );
}
