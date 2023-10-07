/**
 * src/app.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.08.23
 *
 */
import { config } from "dotenv";
import * as express from "express";
import { getRoutes } from "./routes";
import * as cors from "cors";
import * as chalk from "chalk";
import mongoose from "mongoose";
import * as schedule from "node-schedule";
import { sendPN } from "./util/sendPN";
import { Server } from "socket.io";
import { createServer } from "http";
import AuthenticateChannel from "./socket/channels/AuthenticateChannel";
import SocketRegistry from "./socket/SocketRegistry";
import ConnectionInfoChannel from "./socket/channels/ConnectionInfoChannel";
import ListChatsChannel from "./socket/channels/ListChatsChannel";
import CreateChatChannel from "./socket/channels/CreateChatChannel";
import DeleteChatChannel from "./socket/channels/DeleteChatChannel";
import GetChatChannel from "./socket/channels/GetChatChannel";
import CreateChatMessageChannel from "./socket/channels/CreateChatMessageChannel";

/* LOGGER */

const log = console.log;

const fancyLog = (type: string, message: string) => {
  const date = `[${new Date().toLocaleString()}]`;

  switch (type) {
    case "info":
      log(`${chalk.blue("ⓘ")} ${date} ${message}`);
      break;
    case "warn":
      log(`${chalk.yellow("⚠")} ${date} ${message}`);
      break;
    case "error":
      log(`${chalk.bgRed.black("ERROR")} ${date} ${message}`);
      break;
    default:
      break;
  }
};

console.log = (...args: any[]) => {
  fancyLog("info", args.join(" "));
};
console.info = (...args: any[]) => {
  fancyLog("info", args.join(" "));
};
console.warn = (...args: any[]) => {
  fancyLog("warn", args.join(" "));
};
console.error = (...args: any[]) => {
  fancyLog("error", args.join(" "));
};

/* END LOGGER */

process.on("uncaughtException", (err) => {
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
});

config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
const port = process.env.PORT || 3000;

(async () => {
  const routes = await getRoutes();
  for (const route of Object.keys(routes)) {
    app.all(route, async (req, res) => {
      try {
        if (routes[route].constructor.name === "AsyncFunction") {
          await routes[route].exec(req, res);
        } else {
          routes[route].exec(req, res);
        }
      } catch (e) {
        res
          .status(500)
          .json({
            error: e.message,
            ex: e,
            status: 500,
          })
          .end();
      }
      console.log(
        `{${chalk.green(res.statusCode)}} ${chalk.red(req.path)} -> ${
          routes[route].directory
        }`,
      );
    });
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
    } catch (e) {
      console.error("Could not connect to MongoDB");
      console.error(e);
      process.exit(1);
    }
  }

  app.all("*", (req, res) => {
    res
      .status(404)
      .json({
        error: "Not Found",
        code: 404,
      })
      .end();
  });

  log("Registered Routes:");
  console.table(Object.keys(routes));

  const notifyJob = schedule.scheduleJob("00 17 * * *", async () => {
    await sendPN({
      title: "SaveWorld",
      content: "Es ist Zeit deinen Tagesbericht zu schreiben!",
      user_ids: [],
      launch_url: "https://app.saveworld.one/e2",
    });
  });

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 1e8,
  });

  io.on("connection", (socket) => {
    console.log(
      `[SIO] Socket ${socket.id} connected from ${socket.handshake.address}`,
    );

    new AuthenticateChannel(socket, "sw:auth.authenticate").register();
    new ConnectionInfoChannel(socket, "sw:connection.info").register();
    new ListChatsChannel(socket, "sw:chats.list").register();
    new CreateChatChannel(socket, "sw:chats.create").register();
    new DeleteChatChannel(socket, "sw:chats.delete").register();
    new GetChatChannel(socket, "sw:chats.get").register();
    new CreateChatMessageChannel(socket, "sw:chats.messages.create").register();

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
  global.io = io;

  httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
})();
