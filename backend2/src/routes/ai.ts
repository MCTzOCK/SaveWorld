/**
 * backend2/src/routes/ai.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.01.2024
 *
 */
import { FastifyInstance, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import UserPreferencesModel from "../models/UserPreferencesModel";
import { prompt } from "../util/ai";

export default async function aiPlugin(app: FastifyInstance, opts: any) {
  app.post(
    "/ai/v1",
    {},
    async (
      req: FastifyRequest<{
        Body: {
          prompt: string;
        };
      }>,
      res,
    ) => {
      const { prompt: bPrompt } = req.body;

      if (bPrompt === undefined || bPrompt === null || bPrompt === "") {
        res.status(400);
        res.send({
          error: "Prompt is missing",
        });
        return;
      }

      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401);
        res.send({
          error: "Unauthorized",
        });
        return;
      }

      let leftContingent = 0;
      let model = "gpt-3.5-turbo-0613";

      if (user.role === "admin") {
        leftContingent = 100000;
        model = "gpt-4-0314";
      } else {
        const prefs = await UserPreferencesModel.findOne({
          user: user._id,
        });

        if (prefs.ai_left_usage !== undefined && prefs.ai_left_usage !== null) {
          leftContingent = prefs.ai_left_usage;
        } else {
          leftContingent = 5;
        }

        if (leftContingent - 1 < 0) {
          prefs.ai_left_usage = 0;
        } else {
          prefs.ai_left_usage = leftContingent - 1;
        }

        await prefs.save();
      }

      if (leftContingent <= 0) {
        res.status(403);
        res.send({
          error: "No contingent left",
        });
        return;
      }

      const chatCompletion = await prompt({
        prompt: bPrompt,
        model,
      });

      res.send({
        message: chatCompletion,
        leftContingent: leftContingent - 1,
      });
    },
  );
}
