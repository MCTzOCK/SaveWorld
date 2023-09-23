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
import { getOS } from "./util/getOS";

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
        `${new Date().toLocaleString()} [${chalk.red(
          req.method,
        )}] {${chalk.green(res.statusCode)}} ${chalk.red(req.path)} -> ${
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

  console.log("Registered Routes:");
  console.table(Object.keys(routes));

  const client = getOS();
  const notifyJob = schedule.scheduleJob("00 19 * * *", async () => {
    const notification = await client.createNotification({
      contents: {
        en: "Es ist Zeit deinen Tagesbericht zu schreiben!",
      },
      headings: {
        en: "SaveWorld",
      },
      included_segments: ["All"],
      app_id: process.env.ONE_SIGNAL_USER_KEY,
      url: "https://app.saveworld.one/account",
    });
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
