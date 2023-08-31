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

config();

const app = express();

app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

(async () => {
  const routes = await getRoutes();
  for (const route of Object.keys(routes)) {
    app.all(route, async (req, res) => {
      try {
        if (routes[route].constructor.name === "AsyncFunction") {
          await routes[route](req, res);
        } else {
          routes[route](req, res);
        }

        console.log(
          `${new Date().toLocaleString()} [${chalk.red(
            req.method,
          )}] {${chalk.green(res.statusCode)}} ${chalk.red(req.path)}`,
        );
      } catch (e) {
        res
          .status(500)
          .json({
            error: e.message,
            status: 500,
          })
          .end();
      }
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

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
