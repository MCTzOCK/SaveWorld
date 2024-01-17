/**
 * backend2/src/routes/lifestyle.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */
import { FastifyInstance, FastifyRequest } from "fastify";
import LifestyleTemplateModel from "../models/LifestyleTemplateModel";
import { FastifySchemas } from "../Schemas";
import { isAuth } from "../util/isAuth";
import LifestyleModel from "../models/LifestyleModel";
import { getUserEcoLevel } from "../util/getUserEcoLevel";
import LifestyleSummaryModel from "../models/LifestyleSummaryModel";

export default async function accountPlugin(app: FastifyInstance, opts: any) {
  app.get(
    "/lifestyle/templates",
    {
      config: {
        openapi: {
          description: "Returns all lifestyle templates",
          summary: "Templates",
          tags: ["lifestyle"],
          security: [],
        },
        schema: FastifySchemas.lifestyle_templates,
      },
    },
    async (req: FastifyRequest, res) => {
      const lst = await LifestyleTemplateModel.find({});

      res.status(200).send({ lst });
    },
  );

  app.get(
    "/lifestyle/my",
    {
      config: {
        openapi: {
          description: "Returns the lifestyle of the current user",
          summary: "Lifestyle",
          tags: ["lifestyle"],
          security: [{ jwt: [] }],
        },
        schema: FastifySchemas.lifestyle_my,
      },
    },
    async (req: FastifyRequest, res) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          status: 401,
          error: "Unauthorized",
        });
        return;
      }

      let lfsm = await LifestyleModel.findOne({
        user: user._id,
      });

      if (!lfsm) {
        lfsm = await LifestyleModel.create({
          user: user._id,
          actions: [],
          goals: [],
        });
      }

      res.status(200).send({
        status: 200,
        lifestyle: lfsm,
      });
    },
  );

  app.get(
    "/lifestyle/my/level",
    {
      config: {
        openapi: {
          description: "Returns the eco level of the current user",
          summary: "Eco Level",
          tags: ["lifestyle"],
          security: [{ jwt: [] }],
        },
        schema: FastifySchemas.lifestyle_level,
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

      const lvl = await getUserEcoLevel(user);

      res.status(200).send({
        status: 200,
        level: lvl.level,
        totalGoals: lvl.totalGoals,
        achievedGoals: lvl.achievedGoals,
      });
    },
  );

  app.post(
    "/lifestyle/my/submit",
    {
      config: {
        openapi: {
          description: "Submit a new entry to the lifestyle",
          summary: "Submit Entry",
          tags: ["lifestyle"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.lifestyle_submit,
    },
    async (
      req: FastifyRequest<{
        Body: {
          goals: any[];
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

      const { goals } = req.body;

      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);

      const lfsummary = await LifestyleSummaryModel.findOne({
        user: user._id,
        date: date,
      });

      if (lfsummary) {
        res.status(400).send({
          error: "Already submitted",
          status: 400,
        });
        return;
      }

      const lfsummaryNew = await LifestyleSummaryModel.create({
        user: user._id,
        date: date,
        goals: goals,
      });

      res.status(200).send({
        status: 200,
        data: lfsummaryNew,
      });
    },
  );

  app.post(
    "/lifestyle/my/update",
    {
      config: {
        openapi: {
          description: "Update the lifestyle of the current user",
          summary: "Update Lifestyle",
          tags: ["lifestyle"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.lifestyle_update,
    },
    async (
      req: FastifyRequest<{
        Body: {
          goals: any[];
          actions: any[];
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

      let lifestyle = await LifestyleModel.findOne({
        user: user._id,
      });

      if (!lifestyle) {
        lifestyle = await LifestyleModel.create({
          user: user._id,
          actions: [],
          goals: [],
        });
      }

      const { actions, goals } = req.body;

      lifestyle.actions = actions;
      lifestyle.goals = goals;

      await lifestyle.save();

      res.status(200).send({
        status: 200,
      });
    },
  );

  app.get(
    "/lifestyle/my/weekly",
    {
      config: {
        openapi: {
          description: "Returns the lifestyle of the current user",
          summary: "Lifestyle",
          tags: ["lifestyle"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.lifestyle_my_weekly,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          dayInWeek?: string;
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

      const lfs = await LifestyleModel.findOne({
        user: user._id,
      });

      function getWeekDates(date: Date): string[] {
        const weekDates: string[] = [];
        const currentDate = new Date(date);

        // Setze den Wochentag auf Montag (1 entspricht Montag)
        currentDate.setDate(currentDate.getDate() - (currentDate.getDay() - 1));
        currentDate.setUTCHours(0, 0, 0, 0);

        // Füge alle Daten der Woche (Montag bis Sonntag) zum Array hinzu
        for (let i = 0; i < 7; i++) {
          const formattedDate = currentDate.toISOString().split("T")[0];
          weekDates.push(formattedDate);
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return weekDates;
      }

      let dates: Date[] = [];
      if (req.query.dayInWeek) {
        dates = getWeekDates(new Date(req.query.dayInWeek as string)).map(
          (e) => new Date(e),
        );
      } else {
        dates = getWeekDates(new Date()).map((e) => new Date(e));
      }

      const summaries = await LifestyleSummaryModel.find({
        user: user._id,
        date: {
          $in: dates,
        },
      });

      const g: {
        [key: string]: {
          goal: number;
          actual: number;
        };
      } = {};

      for (const x of lfs.goals) {
        let z = 0;
        for (const y of summaries) {
          if (y.goals.find((e) => e.template === x.template)) {
            z += y.goals.find((e) => e.template === x.template).perDay;
          }
        }
        g[x.template] = {
          goal: x.goalPerWeek,
          actual: z,
        };
      }

      res.status(200).send({
        goals: g,
        status: 200,
        startDate: dates[0],
        endDate: dates[dates.length - 1],
      });
    },
  );

  app.get(
    "/lifestyle/my/day/:date",
    {
      config: {
        openapi: {
          description: "Returns the lifestyle of the current user",
          summary: "Lifestyle",
          tags: ["lifestyle"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.lifestyle_my_day,
    },
    async (
      req: FastifyRequest<{
        Params: {
          date: string;
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

      const date = new Date(req.params.date);

      date.setUTCHours(0, 0, 0, 0);

      const lfsummary = await LifestyleSummaryModel.findOne({
        user: user._id,
        date: date,
      });

      if (!lfsummary) {
        res.status(404).send({
          error: "Not found",
          status: 404,
        });
        return;
      }

      res.status(200).send({
        status: 200,
        data: lfsummary,
      });
    },
  );
}
