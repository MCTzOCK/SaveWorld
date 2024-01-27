/**
 * backend2/src/routes/community.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.01.2024
 *
 */
import { FastifyInstance, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import UserPreferencesModel from "../models/UserPreferencesModel";
import UserModel from "../models/UserModel";
import CommunityBlogEntryModel from "../models/CommunityBlogEntryModel";
import { FastifySchemas } from "../Schemas";
import { sendPN } from "../util/sendPN";
import { getUserEcoLevel } from "../util/getUserEcoLevel";

export default async function communityPlugin(app: FastifyInstance, opts: any) {
  app.get(
    "/community/suggested",
    {
      config: {
        openapi: {
          description: "Returns the suggested content",
          summary: "Receive suggested content",
          tags: ["community"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.communtiy_suggested,
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

      const PAGE_SIZE = 4;
      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

      const blocked_by_users_ids = (
        await UserPreferencesModel.find({
          blocked_users: user.username,
        })
      ).map((e) => e.user);

      const blocked_by_users_usernames = (
        await UserModel.find({
          _id: {
            $in: blocked_by_users_ids,
          },
        })
      ).map((e) => e.username);

      const entries = await CommunityBlogEntryModel.find({
        username: {
          $nin: blocked_by_users_usernames,
        },
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

  app.get(
    "/community/search",
    {
      config: {
        openapi: {
          description: "Returns the search results",
          summary: "Search",
          tags: ["community"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.communtiy_search,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          type: string;
          q: string;
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

      const type = req.query.type ? req.query.type.toString() : "posts";

      const PAGE_SIZE = 4;

      const blocked_by_users_ids = (
        await UserPreferencesModel.find({
          blocked_users: user.username,
        })
      ).map((e) => e.user);

      const blocked_by_users_usernames = (
        await UserModel.find({
          _id: {
            $in: blocked_by_users_ids,
          },
        })
      ).map((e) => e.username);

      let entries: any[] = [];

      switch (type) {
        case "posts":
          const posts = await CommunityBlogEntryModel.find({
            $or: [
              { title: { $regex: req.query.q.toString(), $options: "i" } },
              { content: { $regex: req.query.q.toString(), $options: "i" } },
            ],
            username: {
              $nin: blocked_by_users_usernames,
            },
          });
          entries = posts.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });

          break;
        case "profiles":
          const profiles = await UserPreferencesModel.find({
            user: {
              $nin: blocked_by_users_ids,
            },
            $or: [
              {
                "community_profile.displayName": {
                  $regex: req.query.q.toString(),
                  $options: "i",
                },
              },
              {
                "community_profile.biography": {
                  $regex: req.query.q.toString(),
                  $options: "i",
                },
              },
              {
                "community_profile.location": {
                  $regex: req.query.q.toString(),
                  $options: "i",
                },
              },
            ],
          });

          for (const p of profiles) {
            let x = p.community_profile as Map<String, any>;

            const userDoc = await UserModel.findById(p.user);

            if (!userDoc) {
              continue;
            }

            entries.push({
              username: userDoc.username,
              displayName: x.get("displayName"),
              biography: x.get("biography"),
              location: x.get("location"),
            });
          }

          break;
        default:
          res.status(400).send({
            error: "Bad Request",
            status: 400,
          });
      }

      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

      res.status(200).send({
        status: 200,
        entries: entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
        pages: Math.ceil(entries.length / PAGE_SIZE),
      });
    },
  );

  app.get(
    "/community/following",
    {
      config: {
        openapi: {
          description: "Returns the following content",
          summary: "Receive following content",
          tags: ["community"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.community_following,
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

      const following = await UserPreferencesModel.find({
        "community_profile.followers": user.username,
      });

      const followingUsernames: string[] = [];

      for (const f of following) {
        followingUsernames.push((await UserModel.findById(f.user))!.username);
      }

      const blocked_by_users_ids = (
        await UserPreferencesModel.find({
          blocked_users: user.username,
        })
      ).map((e) => e.user);

      const blocked_by_users_usernames = (
        await UserModel.find({
          _id: {
            $in: blocked_by_users_ids,
          },
        })
      ).map((e) => e.username);

      const PAGE_SIZE = 4;
      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

      const entries = await CommunityBlogEntryModel.find({
        username: {
          $in: followingUsernames,
          $nin: blocked_by_users_usernames,
        },
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
    "/community/blog/comment",
    {
      config: {
        openapi: {
          description: "Comment a blog entry",
          summary: "Comment",
          tags: ["community"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.community_blog_comment,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
        Body: {
          comment: string;
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

      const { id } = req.query as { id: string };

      if (!id) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const entry = await CommunityBlogEntryModel.findById(id);
      if (!entry) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      const { comment } = req.body as { comment: string };
      if (!comment) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      entry.comments.push({
        username: user.username,
        comment,
        createdAt: Date.now(),
      });

      await entry.save();

      res.status(200).send({
        status: 200,
        entry,
      });

      await sendPN({
        title: "SaveWorld",
        content: `@${user.username} hat deinen Beitrag "${entry.title}" kommentiert!`,
        user_ids: [(await UserModel.findOne({ username: entry.username }))._id],
        launch_url: "https://app.saveworld.one/community/r/" + entry._id,
      });
    },
  );

  app.post(
    "/community/blog/create",
    {
      config: {
        openapi: {
          description: "Create a blog entry",
          summary: "Create",
          tags: ["community"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.community_blog_create,
    },
    async (
      req: FastifyRequest<{
        Body: {
          content: string;
          title: string;
          tags: string[];
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

      let { content, title, tags } = req.body as {
        content: string;
        title: string;
        tags: string[];
      };

      if (!content || !title || !tags) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      content = content.trim();
      title = title.trim();
      tags = tags.map((t) => t.trim());

      const entry = await CommunityBlogEntryModel.create({
        username: user.username,
        title,
        content,
        tags,
        likes: [],
        comments: [],
      });

      res.status(200).send({
        status: 200,
        entry,
      });

      const userPrefs = await UserPreferencesModel.findOne({
        user: user._id,
      });

      let external_uids: string[] = [];

      for (const f of (userPrefs.community_profile as Map<String, any>).get(
        "followers",
      ) as string[]) {
        const uDoc = await UserModel.findOne({
          username: f,
        });

        if (uDoc) {
          external_uids.push(uDoc._id);
        }
      }

      await sendPN({
        title: "SaveWorld",
        content: `@${user.username} hat gerade einen Beitrag veröffentlicht!`,
        user_ids: external_uids,
        launch_url: "https://app.saveworld.one/community/r/" + entry._id,
      });

      // mentions

      const mentions = content.match(/@([a-zA-Z0-9_]+)/g);

      if (mentions) {
        for (const m of mentions) {
          const username = m.replace("@", "");

          const userDoc = await UserModel.findOne({
            username: username,
          });

          if (!userDoc) continue;

          await sendPN({
            title: "SaveWorld",
            content: `@${user.username} hat dich gerade in einem Beitrag erwähnt!`,
            user_ids: [userDoc._id],
            launch_url: "https://app.saveworld.one/community/r/" + entry._id,
          });
        }
      }
    },
  );

  app.delete(
    "/community/blog/delete",
    {
      config: {
        openapi: {
          description: "Delete a blog entry",
          summary: "Delete",
          tags: ["community"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.community_blog_delete,
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

      const { id } = req.query as { id: string };

      const entry = await CommunityBlogEntryModel.findById(id);
      if (!entry) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      if (entry.username != user.username && user.role !== "admin") {
        res.status(403).send({
          error: "Forbidden",
          status: 403,
        });
        return;
      }

      await entry.deleteOne();

      res.status(200).send({
        status: 200,
        entry,
      });
    },
  );

  app.get(
    "/community/blog/like",
    {
      config: {
        openapi: {
          description: "Like a blog entry",
          summary: "Like",
          tags: ["community"],
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

      const { id } = req.query as { id: string };

      if (!id) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const entry = await CommunityBlogEntryModel.findById(id);
      if (!entry) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      let sendNotification = false;

      if (entry.likes.includes(user.username)) {
        entry.likes = entry.likes.filter((e) => e != user.username);
      } else {
        entry.likes.push(user.username);
        sendNotification = true;
      }

      await entry.save();

      res.status(200).send({
        status: 200,
        entry,
      });

      if (sendNotification) {
        await sendPN({
          title: "SaveWorld",
          content: `@${user.username} hat deinen Beitrag "${entry.title}" geliked!`,
          user_ids: [
            (await UserModel.findOne({ username: entry.username }))._id,
          ],
          launch_url: "https://app.saveworld.one/community/r/" + entry._id,
        });
      }
    },
  );

  app.get(
    "/community/blog/receive",
    {
      config: {
        openapi: {
          description: "Receive a blog entry",
          summary: "Receive",
          tags: ["community"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.community_blog_receive,
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

      const { id } = req.query as { id: string };

      if (!id) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const entry = await CommunityBlogEntryModel.findById(id);
      if (!entry) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      res.status(200).send({
        status: 200,
        entry,
      });
    },
  );

  app.get(
    "/community/profile/:username",
    {
      config: {
        openapi: {
          description: "Returns the profile of a user",
          summary: "Receive profile",
          tags: ["community"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.community_profile_receive,
    },
    async (
      req: FastifyRequest<{
        Params: {
          username: string;
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

      const { username } = req.params;

      if (!username) {
        res.status(400).send({
          error: "Please provide a username",
          status: 400,
        });
        return;
      }

      const userDoc = await UserModel.findOne({
        username: username.toString(),
      });

      if (!userDoc) {
        res.status(404).send({
          error: "User not found",
          status: 404,
        });
        return;
      }

      const prefs = await UserPreferencesModel.findOne({ user: userDoc._id });

      if (!prefs) {
        res.status(404).send({
          error: "User not found",
          status: 404,
        });
        return;
      }

      if (!prefs.community_profile) {
        prefs.community_profile = new Map<String, any>();
        prefs.community_profile.set("banner", "");
        prefs.community_profile.set("biography", "");
        prefs.community_profile.set("displayName", "");
        prefs.community_profile.set("location", "");
        prefs.community_profile.set("showLevel", false);
        prefs.community_profile.set("followers", []);
        prefs.markModified("community_profile");
        await prefs.save();
      }

      if (!prefs.blocked_users) {
        prefs.blocked_users = [];
        prefs.markModified("blocked_users");
        await prefs.save();
      }

      let lvl = 0;

      if (prefs.community_profile.get("showLevel")) {
        lvl = (await getUserEcoLevel(userDoc)).level;
      }

      if (prefs.blocked_users.includes(user.username.toString())) {
        res.status(403).send({
          error: "User blocked",
          status: 403,
        });
        return;
      }

      res.send({
        status: 200,
        profile: prefs.community_profile,
        level: "" + JSON.stringify(lvl) + "",
      });
    },
  );

  app.get(
    "/community/profile/:username/follow",
    {
      config: {
        openapi: {
          description: "Follow a user",
          summary: "Follow",
          tags: ["community"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.community_profile_follow,
    },
    async (
      req: FastifyRequest<{
        Params: {
          username: string;
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

      const { username } = req.params;

      if (username === user.username) {
        res.status(403).send({
          error: "You can't follow yourself",
          status: 403,
        });
        return;
      }

      const userDoc = await UserModel.findOne({
        username: username,
      });

      if (!userDoc) {
        res.status(404).send({
          error: "User not found",
          status: 404,
        });
        return;
      }

      const pref = await UserPreferencesModel.findOne({
        user: userDoc._id,
      });

      if (!pref) {
        res.status(404).send({
          error: "User not found",
          status: 404,
        });
        return;
      }

      let shouldNotify = false;

      if (
        new Map<String, any>(pref.community_profile)
          .get("followers")
          .includes(user.username)
      ) {
        new Map<String, any>(pref.community_profile)
          .get("followers")
          .splice(
            new Map<String, any>(pref.community_profile)
              .get("followers")
              .indexOf(user.username),
            1,
          );
      } else {
        new Map<String, any>(pref.community_profile)
          .get("followers")
          .push(user.username);
        shouldNotify = true;
      }

      pref.markModified("community_profile");
      await pref.save();

      if (shouldNotify) {
        await sendPN({
          title: "SaveWorld",
          content: `@${user.username} folgt dir jetzt!`,
          user_ids: [userDoc._id],
          launch_url:
            "https://app.saveworld.one/community/u/" + userDoc.username,
        });
      }

      res.status(200).send({
        status: 200,
      });
    },
  );

  app.get(
    "/community/profile/:username/blogs",
    {
      config: {
        openapi: {
          description: "Returns the blogs of a user",
          summary: "Receive blogs",
          tags: ["community"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.community_profile_blogs,
    },
    async (
      req: FastifyRequest<{
        Params: {
          username: string;
        };
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

      const { username } = req.params;

      if (!username) {
        res.status(400).send({
          error: "Please provide a username",
          status: 400,
        });
        return;
      }

      const userDoc = await UserModel.findOne({ username: username });
      const userPrefs = await UserPreferencesModel.findOne({
        user: userDoc._id,
      });

      if (userPrefs.blocked_users.includes(user.username)) {
        res.status(200).send({
          entries: [],
          pages: 0,
          status: 200,
        });
        return;
      }

      const PAGE_SIZE = 4;
      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;

      const entries = await CommunityBlogEntryModel.find({
        username: username.toString(),
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
}
