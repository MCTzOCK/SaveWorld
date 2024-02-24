/**
 * backend2/src/routes/account.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import UserModel from "../models/UserModel";
import { FastifySchemas } from "../Schemas";
import { isAuth } from "../util/isAuth";
import { createHash, randomBytes } from "crypto";
import { authenticator } from "otplib";
import { sign } from "jsonwebtoken";
import UserPreferencesModel from "../models/UserPreferencesModel";
import { sendEmailCode, sendRegisterEmail } from "../util/sendMail";
import { getRedisClient } from "../util/redis";

export default async function accountPlugin(app: FastifyInstance, opts: any) {
  /** @deprecated */
  app.get(
    "/account/activate",
    {
      schema: FastifySchemas.account_activate,
      config: {
        openapi: {
          description: "Activates an account",
          summary: "Activate account",
          tags: ["account"],
          security: [],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          token: string;
        };
      }>,
      res,
    ) => {
      res.status(299).send({
        status: 299,
        error: "This endpoint is deprecated. Please use /account/register/code",
      });

      return;
      const { token } = req.query;

      const user = await UserModel.findOne({
        activationToken: token,
      });

      if (!user) {
        res.status(400).send({
          error: "Please provide a valid token",
          status: 400,
        });
        return;
      }

      user.active = true;
      user.activationToken = "";
      await user.save();

      res.status(200).send({
        status: 200,
        message: "Account activated successfully",
      });
    },
  );

  app.delete(
    "/account/delete",
    {
      schema: FastifySchemas.account_delete,
      config: {
        openapi: {
          description: "Deletes an account",
          summary: "Delete account",
          tags: ["account"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (req, res) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          status: 401,
          error: "Unauthorized",
        });
        return;
      }

      const pUser = await UserModel.findById(user.id);

      if (!pUser || !pUser.active) {
        res.status(401).send({
          status: 401,
          error: "Unauthorized",
        });
        return;
      }

      if (pUser.role === "admin") {
        res.status(401).send({
          status: 401,
          error: "Cannot delete admin account",
        });
      }

      await pUser.deleteOne();

      res.status(200).send({
        status: 200,
        message: "Account deleted successfully",
      });
    },
  );

  app.post(
    "/account/login/code",
    {
      schema: {},
      config: {
        openapi: {
          description: "Logs into an account",
          summary: "Login v2",
          tags: ["account"],
          security: [],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: {
          email: string;
          emailCode?: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      if (!req.body.email) {
        res.status(400).send({
          status: 400,
          error: "Please provide a valid email address",
        });
        return;
      }

      const user = await UserModel.findOne({
        email: req.body.email,
      });

      if (!user) {
        res.status(400).send({
          status: 400,
          error: "Please provide a valid email address",
        });
        return;
      }

      const redis = await getRedisClient();

      if (req.body.emailCode) {
        const emailCode = await redis.get(`emailCode:${user.email}`);

        if (emailCode !== req.body.emailCode) {
          res.status(400).send({
            status: 400,
            error: "Please provide a valid email code",
          });
          return;
        }

        await redis.del(`emailCode:${user.email}`);

        const jsonwebtoken = sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "365d",
          },
        );

        res.status(200).send({
          status: 200,
          message: "Login successful",
          token: jsonwebtoken,
        });
      } else {
        const emailCode = Math.floor(
          100000 + Math.random() * 900000,
        ).toString();
        await redis.set(`emailCode:${user.email}`, emailCode);
        await redis.expireAt(
          `emailCode:${user.email}`,
          Math.floor(Date.now() / 1000) + 60 * 15,
        );

        await sendEmailCode({
          to: user.email,
          code: emailCode,
          firstName: user.firstName,
          lastName: user.lastName,
          protocol: req.protocol,
          hostname: req.hostname,
        });

        res.status(200).send({
          status: 200,
          message: "Email sent",
        });
      }
    },
  );

  /** @deprecated */
  app.post(
    "/account/login",
    {
      schema: FastifySchemas.account_login,
      config: {
        openapi: {
          description: "Logs into an account",
          summary: "Login",
          tags: ["account"],
          security: [],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: {
          email: string;
          password: string;
          totpCode?: string;
        };
      }>,
      res,
    ) => {
      res.status(299).send({
        status: 299,
        error: "This endpoint is deprecated. Please use /account/register/code",
      });

      return;
      const { email, password, totpCode } = req.body;

      if (!email || !password) {
        res.status(400).send({
          status: 400,
          error: "Please provide a valid email address and password",
        });
        return;
      }

      const user = await UserModel.findOne({
        email,
      });

      if (!user) {
        res.status(400).send({
          status: 400,
          error: "Please provide a valid email address and password",
        });
        return;
      }

      if (!user.active) {
        res.status(400).send({
          status: 400,
          error: "Please activate your account first",
        });
        return;
      }

      if (
        user.password !== createHash("sha512").update(password).digest("hex")
      ) {
        res.status(400).send({
          status: 400,
          error: "Please provide a valid email address and password",
        });
        return;
      }

      if (user.totpSecret && !authenticator.check(totpCode, user.totpSecret)) {
        res.status(400).send({
          status: 400,
          error: "Your TOTP code is invalid",
        });
        return;
      }

      const jsonwebtoken = sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "365d",
        },
      );

      res.status(200).send({
        status: 200,
        message: "Login successful",
        token: jsonwebtoken,
      });
    },
  );

  app.get(
    "/account/preferences",
    {
      schema: FastifySchemas.account_preferences_get,
      config: {
        openapi: {
          description: "Receive user preferences",
          summary: "User preferences",
          tags: ["account"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (req, res) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      let prefs = await UserPreferencesModel.findOne({ user: user._id });

      if (!prefs) {
        prefs = await UserPreferencesModel.create({
          user: user._id,
          interests: [],
        });
      }

      res.send({ prefs });
    },
  );

  app.post(
    "/account/preferences",
    {
      schema: FastifySchemas.account_preferences_post,
      config: {
        openapi: {
          description: "Update user preferences",
          summary: "User preferences",
          tags: ["account"],
          security: [{ jwt: [] }],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Body: {
          update: any;
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

      let prefs = await UserPreferencesModel.findOne({ user: user._id });

      if (!prefs) {
        prefs = await UserPreferencesModel.create({
          user: user._id,
          interests: [],
        });
      }

      const { update } = req.body;

      if (!update) {
        res.status(400).send({
          error: "Please provide an update object",
          status: 400,
        });
        return;
      }

      const disallowed = [
        "_id",
        "user",
        "__v",
        "ai_left_usage",
        "ai_resets_usage",
      ];

      for (const key in update) {
        if (disallowed.includes(key)) {
          res.status(400).send({
            error: "Please provide a valid update object",
            status: 400,
          });
          return;
        }

        if (key === "community_profile") {
          update[key].followers = prefs[key].followers || [];
        }

        prefs[key] = update[key];
      }

      await prefs.save();
      res.status(200).send({ prefs });
    },
  );

  app.post(
    "/account/register/code",
    {
      config: {
        openapi: {
          description: "Register an account",
          summary: "Register",
          tags: ["account"],
          security: [],
        },
      },
      schema: {},
    },
    async (
      req: FastifyRequest<{
        Body: {
          email: string;
          emailCode?: string;
          firstName?: string;
          lastName?: string;
          username?: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      if (!req.body.email) {
        res.status(400).send({
          status: 400,
          error: "Please provide a valid email address",
        });
        return;
      }

      const redis = await getRedisClient();

      if (req.body.emailCode) {
        const emailCode = await redis.get(
          `emailCode_register:${req.body.email}`,
        );

        if (emailCode !== req.body.emailCode) {
          res.status(400).send({
            status: 400,
            error: "Please provide a valid email code",
          });
          return;
        }

        const user = await UserModel.findOne({
          email: req.body.email,
        });

        if (!user) {
          res.status(400).send({
            status: 400,
            error: "Please provide all required fields",
          });
          return;
        }

        user.active = true;
        user.activationToken = "";
        await user.save();

        await redis.del(`emailCode_register:${req.body.email}`);

        const jsonwebtoken = sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "365d",
          },
        );

        res.status(200).send({
          status: 200,
          message: "Login successful",
          token: jsonwebtoken,
        });
      } else {
        if (!req.body.firstName || !req.body.lastName || !req.body.username) {
          res.status(400).send({
            status: 400,
            error: "Please provide all required fields",
          });
          return;
        }

        const user = await UserModel.findOne({
          email: req.body.email,
        });

        if (user) {
          res.status(400).send({
            status: 400,
            error: "Email already in use",
          });
          return;
        }

        const user2 = await UserModel.findOne({
          username: req.body.username,
        });

        if (user2) {
          res.status(400).send({
            status: 400,
            error: "Username already in use",
          });
          return;
        }

        const emailCode = Math.floor(
          100000 + Math.random() * 900000,
        ).toString();
        await redis.set(`emailCode_register:${req.body.email}`, emailCode);
        await redis.expireAt(
          `emailCode_register:${req.body.email}`,
          Math.floor(Date.now() / 1000) + 60 * 15,
        );

        await sendEmailCode({
          to: req.body.email,
          code: emailCode,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          protocol: req.protocol,
          hostname: req.hostname,
        });

        const userMod = await UserModel.create({
          username: req.body.username,
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          activationToken: null,
          active: true,
          role: "user",
          password: randomBytes(128).toString("hex"),
        });

        res.status(200).send({
          status: 200,
          message: "Email sent",
        });
      }
    },
  );

  /** @deprecated */
  app.post(
    "/account/register",
    {
      config: {
        openapi: {
          description: "Register an account",
          summary: "Register",
          tags: ["account"],
          security: [],
        },
      },
      schema: FastifySchemas.account_register,
    },
    async (
      req: FastifyRequest<{
        Body: {
          username: string;
          password: string;
          email: string;
          firstName: string;
          lastName: string;
        };
      }>,
      res,
    ) => {
      res.status(299).send({
        status: 299,
        error: "This endpoint is deprecated. Please use /account/register/code",
      });

      return;

      const { username, password, email, firstName, lastName } = req.body;

      if (!username || !password || !email || !firstName || !lastName) {
        res.status(400).send({
          status: 400,
          error: "Please provide all required fields",
        });
        return;
      }
      if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        res.status(400).send({
          status: 400,
          error: "Please provide a valid email address",
        });
        return;
      }

      if (password.length < 8) {
        res.status(400).send({
          status: 400,
          error: "Please provide a password with at least 8 characters",
        });
        return;
      }

      const activationToken = randomBytes(64).toString("hex");

      const user = await UserModel.create({
        username,
        password: createHash("sha512").update(password).digest("hex"),
        email,
        firstName,
        lastName,
        activationToken,
        active: false,
      });

      const userPreferences = await UserPreferencesModel.create({
        user: user._id,
        interests: [],
      });

      await sendRegisterEmail({
        to: email,
        firstName: firstName,
        lastName: lastName,
        activationToken: activationToken,
        protocol: req.protocol,
        hostname: req.hostname,
      });

      res.status(200).send({
        status: 200,
        message: "Account created successfully. Please check your emails.",
      });
    },
  );

  app.post(
    "/account/update",
    {
      config: {
        openapi: {
          description: "Updates an account",
          summary: "Update account",
          tags: ["account"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.account_update,
    },
    async (
      req: FastifyRequest<{
        Body: {
          update: any;
          totpCode?: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          status: 401,
          error: "Unauthorized",
        });
        return;
      }

      if (!user) {
        res.status(401).send({
          status: 401,
          error: "Unauthorized",
        });
        return;
      }

      const pUser = await UserModel.findById(user.id);

      if (!pUser || !pUser.active) {
        res.status(401).send({
          status: 401,
          error: "Unauthorized",
        });
        return;
      }

      const { update, totpCode } = req.body;

      if (!update) {
        res.status(400).send({
          status: 400,
          error: "Please provide all required fields",
        });
        return;
      }

      if (!totpCode && pUser.totpSecret && pUser.totpSecret.length > 0) {
        res.status(400).send({
          status: 400,
          error: "Please provide a valid totp code",
        });
        return;
      }

      if (totpCode && pUser.totpSecret && pUser.totpSecret.length > 0) {
        if (
          !authenticator.verify({
            token: totpCode,
            secret: pUser.totpSecret,
          })
        ) {
          res.status(400).send({
            status: 400,
            error: "Please provide a valid totp code",
          });
          return;
        }
      }

      const updatableKeys = ["firstName", "lastName", "password", "totpActive"];

      let totpSecret = "";

      for (const key of Object.keys(update)) {
        if (!updatableKeys.includes(key)) {
          res.status(400).send({
            status: 400,
            error: "Please provide a valid key",
          });
          return;
        }

        if (key === "password") {
          user.password = createHash("sha512")
            .update(update[key])
            .digest("hex");
        } else if (key === "totpActive") {
          if (update[key]) {
            user.totpSecret = authenticator.generateSecret();
            totpSecret = user.totpSecret;
          } else {
            user.totpSecret = "";
          }
        } else {
          user[key] = update[key];
        }
      }

      await user.save();

      res.status(200).send({
        status: 200,
        message: "Account updated successfully",
        totpSecret: totpSecret.length > 0 ? totpSecret : undefined,
      });
    },
  );

  app.get(
    "/account/verify-token",
    {
      config: {
        openapi: {
          description: "Verifies a token",
          summary: "Verify token",
          tags: ["account"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.account_verify_token,
    },
    async (req, res) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          status: 401,
          error: "Unauthorized",
        });
        return;
      }

      const pUser = await UserModel.findById(user.id);

      if (!pUser || !pUser.active) {
        res.status(401).send({
          status: 401,
          error: "Unauthorized",
        });
        return;
      }

      res.status(200).send({
        status: 200,
        user: {
          id: pUser.id,
          email: pUser.email,
          firstName: pUser.firstName,
          lastName: pUser.lastName,
          totpActive: !!pUser.totpSecret,
          role: pUser.role,
          username: pUser.username,
        },
      });
    },
  );
}
