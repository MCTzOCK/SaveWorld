/**
 * backend2/src/server.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */

import { config } from "dotenv";

config();

import Fastify from "fastify";
import * as path from "path";
import fastifyCors from "@fastify/cors";
import fstatic from "@fastify/static";
import AutoLoad from "@fastify/autoload";
import mongoose from "mongoose";
import * as fastifyMultipart from "@fastify/multipart";
import * as fastifySocketIO from "fastify-socket.io";
import AuthenticateChannel from "./socket/channels/AuthenticateChannel";
import ConnectionInfoChannel from "./socket/channels/ConnectionInfoChannel";
import ListChatsChannel from "./socket/channels/ListChatsChannel";
import CreateChatChannel from "./socket/channels/CreateChatChannel";
import DeleteChatChannel from "./socket/channels/DeleteChatChannel";
import GetChatChannel from "./socket/channels/GetChatChannel";
import CreateChatMessageChannel from "./socket/channels/CreateChatMessageChannel";
import ChatMessagesChannel from "./socket/channels/ChatMessagesChannel";
import AddChatGroupMemberChannel from "./socket/channels/AddChatGroupMemberChannel";
import SocketRegistry from "./socket/SocketRegistry";
import * as scheduler from "node-schedule";
import UserPreferencesModel from "./models/UserPreferencesModel";

(async () => {
  const openapiDocs = await import("fastify-openapi-docs");

  const fastify = Fastify({
    logger: {
      level: "info",
    },
    ajv: {
      customOptions: {
        allowUnionTypes: true,
      },
    },
    maxParamLength: 1000,
  });

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
      fastify.log.info("Connected to MongoDB");
    } catch (e) {
      fastify.log.error("Error while connecting to MongoDB");
      fastify.log.error(e);
      process.exit(1);
    }
  }

  fastify.addHook("onSend", async function (req, res) {
    res.headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "GET, POST, OPTIONS, HEAD, PUT, PATCH, DELETE, CONNECT, TRACE",
      "Access-Control-Allow-Headers":
        "Content-Type, Accept, X-AUTH" +
        req.headers["access-control-request-headers"]
          ? ", " + req.headers["access-control-request-headers"]
          : "",
    });
  });

  // catch cors preflight
  fastify.options("*", async function (req, res) {
    res.headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "GET, POST, OPTIONS, HEAD, PUT, PATCH, DELETE, CONNECT, TRACE",
      "Access-Control-Allow-Headers":
        "Content-Type, Accept, X-AUTH" +
        req.headers["access-control-request-headers"]
          ? ", " + req.headers["access-control-request-headers"]
          : "",
    });
    res.status(204);
    res.send();
  });

  fastify.register(fastifyMultipart.default, {
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
    },
  });

  fastify.register(fastifySocketIO.default, {
    cors: {
      origin: "*",
      methods: [
        "GET",
        "POST",
        "OPTIONS",
        "HEAD",
        "PUT",
        "PATCH",
        "DELETE",
        "CONNECT",
        "TRACE",
      ],
    },
    maxHttpBufferSize: 1e8,
  });

  fastify.register(fstatic, {
    root: path.join(__dirname, "..", "public"),
    prefix: "/public/",
  });

  fastify.register(openapiDocs.default, {
    openapi: {
      openapi: "3.0.3",
      info: {
        title: "SaveWorld API",
        description: "SaveWorld API",
        contact: {
          name: "Ben Siebert",
          email: "hello@ben-siebert.de",
          url: "https://ben-siebert.com",
        },
        version: "2.0.0",
      },
      servers: [
        {
          url: "https://api.saveworld.one",
          description: "Production",
        },
        {
          url: "https://dev.saveworld.one",
          description: "Development",
        },
      ],
      tags: [
        { name: "account", description: "Account related APIs" },
        {
          name: "notifications",
          description: "(Push-)Notifications related APIs",
        },
        {
          name: "lifestyle",
          description: "Lifestyle related APIs",
        },
        {
          name: "content",
          description: "Content related APIs",
        },
        {
          name: "recipes",
          description: "Recipe related APIs",
        },
        {
          name: "eatingplan",
          description: "Eatingplan related APIs",
        },
        {
          name: "eco-projects",
          description: "Eco-Projects related APIs",
        },
        {
          name: "community",
          description: "Community related APIs",
        },
        {
          name: "admin",
          description: "Admin related APIs",
        },
        {
          name: "tracker",
          description: "Eco-Tracker related APIs",
        },
        {
          name: "media",
          description: "Media File related APIs",
        },
        {
          name: "support",
          description: "Support System related APIs",
        },
        {
          name: "system",
          description: "System relevant endpoints",
        },
      ],
      components: {
        securitySchemes: {
          jwt: {
            type: "apiKey",
            in: "header",
            name: "X-AUTH",
          },
        },
      },
    },
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, { prefix: "/" }),
  });

  fastify.ready().then(() => {
    // @ts-ignore
    fastify.io.on("connection", (socket) => {
      console.log(
        `[SIO] Socket ${socket.id} connected from ${socket.handshake.address}`,
      );

      new AuthenticateChannel(socket, "sw:auth.authenticate").register();
      new ConnectionInfoChannel(socket, "sw:connection.info").register();
      new ListChatsChannel(socket, "sw:chats.list").register();
      new CreateChatChannel(socket, "sw:chats.create").register();
      new DeleteChatChannel(socket, "sw:chats.delete").register();
      new GetChatChannel(socket, "sw:chats.get").register();
      new CreateChatMessageChannel(
        socket,
        "sw:chats.messages.create",
      ).register();
      new ChatMessagesChannel(socket, "sw:chats.messages.get").register();
      new AddChatGroupMemberChannel(
        socket,
        "sw:chats.groups.add.member",
      ).register();
      //KEEP_CHANNEL_ADD_POINT

      socket.onAny((event, ...args) => {
        console.log(
          `[SIO] Socket ${socket.id} called event ${event} with ${args}`,
        );
      });

      socket.on("disconnect", () => {
        delete SocketRegistry.loggedIn[socket.id];
        console.log(
          `[SIO] Socket ${socket.id} disconnected from ${socket.handshake.address}`,
        );
      });
    });
    // @ts-ignore
    global.io = fastify.io;
  });

  await fastify.listen(process.env.PORT || 3000, "0.0.0.0");

  scheduler.scheduleJob("28 12 * * *", async () => {
    await UserPreferencesModel.updateMany(
      {
        ai_left_usage: { $lt: 6 },
      },
      { $set: { ai_left_usage: 5 } },
    );
  });
})();
