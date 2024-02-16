/**
 * backend2/src/routes/games.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.02.2024
 *
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import UserPreferencesModel from "../models/UserPreferencesModel";
import UserModel from "../models/UserModel";
import { FastifySchemas } from "../Schemas";

export default async function communityPlugin(app: FastifyInstance, opts: any) {
  app.post(
    "/games/leaderboard/:game",
    {
      schema: {},
      config: {
        openapi: {
          description: "Get the leaderboard for a specific game",
          tags: ["games"],
          security: [
            {
              jwt: [],
            },
          ],
        },
      },
    },
    async (
      req: FastifyRequest<{
        Params: {
          game: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { user, auth } = await isAuth(req);

      if (!auth) {
        return res.status(401).send({ error: "Not authorized" });
      }

      const game = req.params.game as string;
    },
  );
}
