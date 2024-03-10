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
import GameLeaderBoardModel from "../models/GameLeaderBoardModel";
import { checkRequestPermission } from "../util/permissions";
import { Perms } from "../util/Perms";

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
        Body: {
          score: number;
        };
      }>,
      res: FastifyReply,
    ) => {
      if (!req.body.score) {
        return res.status(400).send({ error: "No score provided" });
      }

      const { user, auth } = await isAuth(req);

      if (!auth) {
        return res.status(401).send({ error: "Not authorized" });
      }

      if (!checkRequestPermission(user.role, Perms.GAMES_LEADERBOARD, res))
        return;

      const game = req.params.game as string;

      if (!game) {
        return res.status(400).send({ error: "No game provided" });
      }

      let leaderboard = await GameLeaderBoardModel.findOne({
        game: game,
        user: user._id,
      });

      if (!leaderboard) {
        leaderboard = await GameLeaderBoardModel.create({
          game: game,
          user: user._id,
          score: 0,
        });
      }

      if (leaderboard.score < req.body.score) {
        leaderboard.score = req.body.score;
        leaderboard.save();
      }

      return res.send({ leaderboard });
    },
  );

  app.get(
    "/games/leaderboard/:game/my",
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
      req: FastifyRequest<{ Params: { game: string } }>,
      res: FastifyReply,
    ) => {
      const { user, auth } = await isAuth(req);

      if (!auth) {
        return res.status(401).send({ error: "Not authorized" });
      }
      if (!checkRequestPermission(user.role, Perms.GAMES_LEADERBOARD, res))
        return;

      const game = req.params.game as string;

      if (!game) {
        return res.status(400).send({ error: "No game provided" });
      }

      let leaderboard = await GameLeaderBoardModel.findOne({
        game: game,
        user: user._id,
      });

      if (!leaderboard) {
        leaderboard = await GameLeaderBoardModel.create({
          game: game,
          user: user._id,
          score: 0,
        });
      }

      return res.send({ leaderboard });
    },
  );

  app.get(
    "/games/leaderboard/:game",
    {
      schema: {},
      config: {
        openapi: {
          description: "Get the leaderboard for a specific game",
          tags: ["games"],
        },
      },
    },
    async (
      req: FastifyRequest<{ Params: { game: string } }>,
      res: FastifyReply,
    ) => {
      const game = req.params.game as string;

      if (!game) {
        return res.status(400).send({ error: "No game provided" });
      }

      let leaderboard = await GameLeaderBoardModel.find({
        game: game,
      })
        .sort({ score: -1 })
        .limit(25)
        .populate("user");

      // remove user data

      leaderboard = leaderboard.map((l) => {
        return {
          score: l.score,
          user: {
            username: l.user.username,
            _id: l.user._id,
          },
        };
      });

      let lb = {
        ...leaderboard,
      };

      return res.send({ leaderboard: lb });
    },
  );
}
