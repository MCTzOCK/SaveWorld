/**
 * backend2/src/routes/ecoProjects.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.01.2024
 *
 */
import { FastifyInstance, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import EcoProjectModel from "../models/EcoProjectModel";
import { FastifySchemas } from "../Schemas";
import { searchNominatim } from "../util/nominatimHelpers";
import ical, { ICalCalendarMethod } from "ical-generator";
import EcoProjectToDoListModel from "../models/EcoProjectToDoListModel";
import EcoProjectToDoListItemModel from "../models/EcoProjectToDoListItemModel";
import EcoProjectHomepageSegmentModel from "../models/EcoProjectHomepageSegmentModel";

export default async function ecoProjectsPlugin(
  app: FastifyInstance,
  opts: any,
) {
  app.get(
    "/eco-projects/my",
    {
      config: {
        openapi: {
          description: "Returns the requested eco projects",
          summary: "Receive eco projects",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_my,
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

      const projects = await EcoProjectModel.find({
        $or: [
          { owner: user._id },
          {
            users: {
              $elemMatch: {
                userId: user._id,
              },
            },
          },
        ],
      });

      res.status(200).send({
        projects,
        status: 200,
      });
    },
  );

  app.get(
    "/eco-projects/list",
    {
      config: {
        openapi: {
          description: "Returns the requested eco projects (paginated)",
          summary: "Receive eco projects",
          tags: ["eco-projects"],
          security: [],
        },
      },
      schema: {},
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          page?: number;
          q?: string;
        };
      }>,
      res,
    ) => {
      const PAGE_SIZE = 4;
      const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
      const search = req.query.q ? req.query.q.toString() : "";

      const entries = await EcoProjectModel.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { geoLocationDisplayName: { $regex: search, $options: "i" } },
        ],
        // startDate: { $gte: new Date() },
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
    "/eco-projects/create",
    {
      config: {
        openapi: {
          description: "Creates a new eco project",
          summary: "Create eco project",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_create,
    },
    async (
      req: FastifyRequest<{
        Body: {
          name: string;
          startDate: Date;
          lastsDays: number;
          geoLocation: string;
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

      // geoLocation: should be the display_name received from Nominatim
      const { name, startDate, lastsDays, geoLocation } = req.body;

      if (!name || !startDate || !lastsDays || !geoLocation) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const nRes = await searchNominatim(geoLocation);

      let realGeoLocation: {
        type: "custom" | "nominatim";
        display_name: string;
        lat: string;
        lon: string;
      } = {
        type: "custom",
        display_name: geoLocation,
        lat: "",
        lon: "",
      };

      if (nRes.length > 0) {
        const nResExact = nRes.find((n) => n.display_name === geoLocation);

        if (nResExact) {
          realGeoLocation = {
            type: "nominatim",
            display_name: nResExact.display_name,
            lat: nResExact.lat,
            lon: nResExact.lon,
          };
        }
      }

      const ecoProject = await EcoProjectModel.create({
        owner: user._id,
        name,
        startDate,
        lastsDays,
        geoLocationType: realGeoLocation.type,
        geoLocationDisplayName: realGeoLocation.display_name,
        geoLocationLat: realGeoLocation.lat,
        geoLocationLon: realGeoLocation.lon,
      });

      res.status(200).send({
        project: ecoProject,
        status: 200,
      });
    },
  );

  app.get(
    "/eco-projects/calendar",
    {
      config: {
        openapi: {
          description: "Returns the requested eco projects",
          summary: "Receive eco projects",
          tags: ["eco-projects"],
          security: [],
        },
      },
      schema: FastifySchemas.eco_projects_calendar,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          startDate: string;
          endDate: string;
        };
      }>,
      res,
    ) => {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).send({ error: "Bad Request" });
        return;
      }

      const sDate = new Date(startDate as string);
      const eDate = new Date(endDate as string);

      const projects = await EcoProjectModel.find({
        startDate: {
          $gte: sDate,
          $lte: eDate,
        },
      });

      res.status(200).send({ result: projects });
    },
  );

  app.get(
    "/eco-projects/by-lat-lon",
    {
      config: {
        openapi: {
          description: "Returns the requested eco projects",
          summary: "Receive eco projects",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_by_lat_lon,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          lat: string;
          lon: string;
        };
      }>,
      res,
    ) => {
      const { lat, lon } = req.query;

      if (!lat || !lon) {
        res.status(400).send({ error: "Bad Request" });
        return;
      }

      const entries = await EcoProjectModel.find({
        startDate: { $gte: new Date() },
        geoLocationLat: lat,
        geoLocationLon: lon,
      });

      res.status(200).send({
        status: 200,
        entries: entries,
      });
    },
  );

  app.get(
    "/eco-projects/all-geo-locations",
    {
      config: {
        openapi: {
          description: "Returns the requested eco projects",
          summary: "Receive eco projects",
          tags: ["eco-projects"],
          security: [],
        },
      },
      schema: FastifySchemas.eco_projects_all_geo_locations,
    },
    async (req, res) => {
      const entries = await EcoProjectModel.find({
        startDate: { $gte: new Date() },
      });

      res.status(200).send({
        status: 200,
        entries: entries.map((e) => {
          return [e.geoLocationLat, e.geoLocationLon];
        }),
      });
    },
  );

  app.get(
    "/eco-projects/project/toggle-member-status",
    {
      config: {
        openapi: {
          description: "Toggles the member status of a user",
          summary: "Toggle member status",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_toggle_member_status,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          projectId: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized" });
        return;
      }

      const { projectId } = req.query;

      const project = await EcoProjectModel.findById(projectId);

      if (!project) {
        res.status(404).send({ error: "Project not found", status: 404 });
        return;
      }

      if (project.owner.toString() === user._id.toString()) {
        res.status(403).send({
          error: "You can not leave or join your own project",
          status: 403,
        });
        return;
      }

      if (
        project.users.find((u) => u.userId.toString() === user._id.toString())
      ) {
        project.users = project.users.filter(
          (u) => u.userId.toString() !== user._id.toString(),
        );
      } else {
        project.users.push({
          userId: user._id,
          permissions: "MEMBER",
          username: user.username,
        });
      }

      project.markModified("users");

      await project.save();

      res.status(200).send({
        status: 200,
        memberStatus: project.users.find(
          (u) => u.userId.toString() === user._id.toString(),
        )
          ? 1
          : 0,
      });
    },
  );

  app.get(
    "/eco-projects/project/receive",
    {
      config: {
        openapi: {
          description: "Returns the requested eco project",
          summary: "Receive eco project",
          tags: ["eco-projects"],
          security: [],
        },
      },
      schema: FastifySchemas.eco_projects_receive,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { id } = req.query;

      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      res.status(200).send({
        project: project,
        status: 200,
      });
    },
  );

  app.post(
    "/eco-projects/project/edit",
    {
      config: {
        openapi: {
          description: "Edits an eco project",
          summary: "Edit eco project",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_edit,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
        Body: {
          name: string;
          startDate: Date;
          lastsDays: number;
          geoLocation: string;
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

      const { id } = req.query;

      const { name, startDate, lastsDays, geoLocation } = req.body;

      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !["ADMINISTRATOR", "EDITOR"].includes(
          project.users.find((u) => u.userId).permissions || "NONE",
        ) &&
        user.role !== "admin"
      ) {
        res.status(403).send({
          error: "Forbidden",
          status: 403,
        });
        return;
      }

      project.name = name;
      project.startDate = startDate;
      project.lastsDays = lastsDays;

      const nRes = await searchNominatim(geoLocation);

      let realGeoLocation: {
        type: "custom" | "nominatim";
        display_name: string;
        lat: string;
        lon: string;
      } = {
        type: "custom",
        display_name: geoLocation,
        lat: "",
        lon: "",
      };

      if (nRes.length > 0) {
        const nResExact = nRes.find((n) => n.display_name === geoLocation);

        if (nResExact) {
          realGeoLocation = {
            type: "nominatim",
            display_name: nResExact.display_name,
            lat: nResExact.lat,
            lon: nResExact.lon,
          };
        }
      }

      project.geoLocationType = realGeoLocation.type;
      project.geoLocationDisplayName = realGeoLocation.display_name;
      project.geoLocationLat = realGeoLocation.lat;
      project.geoLocationLon = realGeoLocation.lon;

      await project.save();

      res.status(200).send({
        project: project,
        status: 200,
      });
    },
  );

  app.delete(
    "/eco-projects/project/delete",
    {
      config: {
        openapi: {
          description: "Deletes an eco project",
          summary: "Delete eco project",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_delete,
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

      const { id } = req.query;

      if (!id) {
        res.status(400).send({
          error: "Bad Request",
          status: 400,
        });
        return;
      }

      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !["ADMINISTRATOR"].includes(
          project.users.find((u) => u.userId).permissions || "NONE",
        ) &&
        user.role !== "admin"
      ) {
        res.status(403).send({
          error: "Forbidden",
          status: 403,
        });
        return;
      }

      await project.deleteOne();

      res.status(200).send({
        project: project,
        status: 200,
      });
    },
  );

  app.get(
    "/eco-projects/project/calendar.ics",
    {
      config: {
        openapi: {
          description:
            "Add the requested project to the calendar (should not be called directly)",
          summary: "Eco-Project add to Calendar",
          tags: ["eco-projects"],
          security: [],
        },
      },
      schema: FastifySchemas.eco_projects_to_calendar,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { id } = req.query;
      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      const cal = ical({
        name: "SaveWorld",
        prodId: "//SaveWorld//SaveWorld//DE",
        timezone: "Europe/Berlin",
        method: ICalCalendarMethod.PUBLISH,
        description: "SaveWorld - Projekte",
      });

      cal.createEvent({
        start: new Date(project.startDate),
        end: new Date(
          new Date(project.startDate).setDate(
            new Date(project.startDate).getDate() + project.lastsDays,
          ),
        ),
        location: project.geoLocationDisplayName,
        summary: project.name,
      });

      res.status(200);
      res.header("Content-Type", "text/calendar; charset=utf-8");
      res.header("Content-Disposition", "attachment; filename=calendar.ics");

      res.send(cal.toString());
    },
  );

  app.get(
    "/eco-projects/project/todo/lists",
    {
      config: {
        openapi: {
          description: "Returns the requested todo lists",
          summary: "Receive todo lists",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_todo_lists_receive,
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

      const { id } = req.query;

      if (!id) {
        res.status(400).send({ error: "Bad Request", status: 400 });
        return;
      }

      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({ error: "Not Found", status: 404 });
        return;
      }

      const lists = await EcoProjectToDoListModel.find({
        project: project._id,
      });

      res.status(200).send({
        status: 200,
        lists: lists,
      });
    },
  );

  app.get(
    "/eco-projects/project/todo/items",
    {
      config: {
        openapi: {
          description: "Returns the requested todo items",
          summary: "Receive todo items",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_todo_items,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          listId: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      const { listId } = req.query;

      if (!listId) {
        res.status(400).send({ error: "Bad Request", status: 400 });
        return;
      }

      const list = await EcoProjectToDoListModel.findById(listId);

      if (!list) {
        res.status(404).send({ error: "Not Found", status: 404 });
        return;
      }

      const items = await EcoProjectToDoListItemModel.find({
        list: list._id,
      });

      res.status(200).send({
        status: 200,
        entries: items,
      });
    },
  );

  app.delete(
    "/eco-projects/project/todo/delete-list",
    {
      config: {
        openapi: {
          description: "Deletes a todo list",
          summary: "Delete todo list",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_todo_delete_list,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
          listId: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      const { id, listId } = req.query;

      if (!id || !listId) {
        res.status(400).send({ error: "Bad Request", status: 400 });
        return;
      }

      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({ error: "Not Found", status: 404 });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !["ADMINISTRATOR", "EDITOR"].includes(
          project.users.find((u) => u.userId).permissions || "NONE",
        )
      ) {
        res.status(403).send({
          error: "Forbidden",
          status: 403,
        });
        return;
      }

      const list = await EcoProjectToDoListModel.findById(listId);

      if (!list || project._id.toString() !== list.project.toString()) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      await list.deleteOne();

      res.status(200).send({
        status: 200,
        message: "List deleted",
      });
    },
  );

  app.delete(
    "/eco-projects/project/todo/delete-item",
    {
      config: {
        openapi: {
          description: "Deletes a todo item",
          summary: "Delete todo item",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_todo_delete_item,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
          itemId: string;
          listId: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      const { id, itemId, listId } = req.query;

      if (!id || !itemId || !listId) {
        res.status(400).send({ error: "Bad Request", status: 400 });
        return;
      }

      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({ error: "Not Found", status: 404 });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !["ADMINISTRATOR", "EDITOR"].includes(
          project.users.find((u) => u.userId).permissions || "NONE",
        )
      ) {
        res.status(403).send({
          error: "Forbidden",
          status: 403,
        });
        return;
      }

      const list = await EcoProjectToDoListModel.findById(listId);

      if (!list || project._id.toString() !== list.project.toString()) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      const item = await EcoProjectToDoListItemModel.findById(itemId);

      if (!item || item.list.toString() !== list._id.toString()) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      await item.deleteOne();

      res.status(200).send({
        status: 200,
        message: "Item deleted",
      });
    },
  );

  app.post(
    "/eco-projects/project/todo/create-list",
    {
      config: {
        openapi: {
          description: "Creates a new todo list",
          summary: "Create todo list",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_todo_create_list,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
        Body: {
          title: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      const { id } = req.query;

      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({ error: "Not Found", status: 404 });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !["ADMINISTRATOR", "EDITOR"].includes(
          project.users.find((u) => u.userId).permissions || "NONE",
        )
      ) {
        res.status(403).send({
          error: "Forbidden",
          status: 403,
        });
        return;
      }

      const { title } = req.body;

      const list = await EcoProjectToDoListModel.create({
        project: project._id,
        title,
      });

      res.status(200).send({
        status: 200,
        message: "List created",
      });
    },
  );

  app.post(
    "/eco-projects/project/todo/create-item",
    {
      config: {
        openapi: {
          description: "Creates a new todo item",
          summary: "Create todo item",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_todo_create_item,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
          listId: string;
        };
        Body: {
          title: string;
          description: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      const { id, listId } = req.query;

      if (!id || !listId) {
        res.status(400).send({ error: "Bad Request", status: 400 });
        return;
      }

      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({ error: "Not Found", status: 404 });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !["ADMINISTRATOR", "EDITOR"].includes(
          project.users.find((u) => u.userId).permissions || "NONE",
        )
      ) {
        res.status(403).send({
          error: "Forbidden",
          status: 403,
        });
        return;
      }

      const list = await EcoProjectToDoListModel.findById(listId);

      if (!list || project._id.toString() !== list.project.toString()) {
        res.status(404).send({ error: "Not Found", status: 404 });
        return;
      }

      const { title, description } = req.body;

      const item = await EcoProjectToDoListItemModel.create({
        list: list._id,
        title,
        description,
      });

      res.status(200).send({
        status: 200,
        message: "Item created",
        item: item,
      });
    },
  );

  app.post(
    "/eco-projects/project/todo/check-item",
    {
      config: {
        openapi: {
          description: "Checks a todo item",
          summary: "Check todo item",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: {},
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
          itemId: string;
          listId: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      const { id, itemId, listId } = req.query;

      if (!id || !itemId || !listId) {
        res.status(400).send({ error: "Bad Request", status: 400 });
        return;
      }

      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({ error: "Not Found", status: 404 });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !["ADMINISTRATOR", "EDITOR"].includes(
          project.users.find((u) => u.userId).permissions || "NONE",
        )
      ) {
        res.status(403).send({
          error: "Forbidden",
          status: 403,
        });
        return;
      }

      const list = await EcoProjectToDoListModel.findById(listId);

      if (!list || project._id.toString() !== list.project.toString()) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      const item = await EcoProjectToDoListItemModel.findById(itemId);

      if (!item || item.list.toString() !== list._id.toString()) {
        res.status(404).send({
          error: "Not Found",
          status: 404,
        });
        return;
      }

      item.checked = true;
      item.checkedBy = user.username;
      item.checkedAt = new Date();

      await item.save();

      res.status(200).send({
        status: 200,
        message: "Item checked",
      });
    },
  );

  app.delete(
    "/eco-projects/project/members/delete",
    {
      config: {
        openapi: {
          description: "Deletes a member from a project",
          summary: "Delete member from project",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_members_delete,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          projectId: string;
          userId: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      const { projectId, userId } = req.query;

      const project = await EcoProjectModel.findById(projectId);

      if (!project) {
        res.status(404).send({ error: "Project not found", status: 404 });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !(
          project.users.find(
            (u) => u.userId.toString() === user._id.toString(),
          ) &&
          (project.users.find(
            (u) => u.userId.toString() === user._id.toString(),
          ).permissions === "ADMINISTRATOR" ||
            project.users.find(
              (u) => u.userId.toString() === user._id.toString(),
            ).permissions === "EDITOR") &&
          user.role !== "admin"
        )
      ) {
        res.status(403).send({ error: "Forbidden", status: 403 });
        return;
      }

      const usr = project.users.find(
        (u) => u.userId.toString() === userId.toString(),
      );

      if (!usr) {
        res.status(404).send({ error: "User not in project", status: 404 });
        return;
      }

      project.users = project.users.filter(
        (u) => u.userId.toString() !== userId.toString(),
      );

      project.markModified("users");

      await project.save();

      res.status(200).send({
        status: 200,
        message: "User removed from project",
      });
    },
  );

  app.get(
    "/eco-projects/project/members/change-role",
    {
      config: {
        openapi: {
          description: "Changes the role of a member",
          summary: "Change member role",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_members_change_role,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          projectId: string;
          userId: string;
          newRole: string;
        };
      }>,
      res,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({ error: "Unauthorized", status: 401 });
        return;
      }

      const { projectId, userId, newRole } = req.query;

      const project = await EcoProjectModel.findById(projectId);

      if (!project) {
        res.status(404).send({ error: "Project not found", status: 404 });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !(
          project.users.find(
            (u) => u.userId.toString() === user._id.toString(),
          ) &&
          project.users.find((u) => u.userId.toString() === user._id.toString())
            .permissions === "ADMINISTRATOR"
        ) &&
        user.role !== "admin"
      ) {
        res.status(403).send({ error: "Forbidden", status: 403 });
        return;
      }

      const usr = project.users.find(
        (u) => u.userId.toString() === userId.toString(),
      );

      if (!usr) {
        res.status(404).send({ error: "User not in project", status: 404 });
        return;
      }

      project.users = project.users.map((u) => {
        if (u.userId.toString() === userId.toString()) {
          u.permissions = newRole.toString();
        }

        return u;
      });

      project.markModified("users");

      await project.save();

      res.status(200).send({
        status: 200,
        message: "User role changed",
      });
    },
  );

  app.get(
    "/eco-projects/project/homepage/segments",
    {
      config: {
        openapi: {
          description: "Returns the requested segments",
          summary: "Receive segments",
          tags: ["eco-projects"],
          security: [],
        },
      },
      schema: FastifySchemas.eco_projects_homepage_segments,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
      }>,
      res,
    ) => {
      const { id } = req.query;

      const project = await EcoProjectModel.findById(id);

      if (!project) {
        res.status(404).send({
          status: 404,
          error: "Not Found",
        });
        return;
      }

      const segments = await EcoProjectHomepageSegmentModel.find({
        project: project._id,
      });

      res.status(200).send({
        status: 200,
        segments: segments,
      });
    },
  );

  app.post(
    "/eco-projects/project/homepage/update-segments",
    {
      config: {
        openapi: {
          description: "Updates the segments",
          summary: "Update segments",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_homepage_update_segments,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          projectId: string;
          id: string;
        };
        Body: {
          title: string;
          content: string;
          type: string;
          pinned?: boolean;
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

      const { projectId, id } = req.query;
      const { title, content, type, pinned } = req.body;

      if (!type || !title || !content) {
        res.status(400).send({ error: "Bad Request" });
        return;
      }

      const project = await EcoProjectModel.findById(projectId);

      if (!project) {
        res.status(404).send({
          status: 404,
          error: "Not Found",
        });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !["ADMINISTRATOR", "EDITOR"].includes(
          project.users.find((u) => u.userId).permissions || "NONE",
        ) &&
        user.role !== "admin"
      ) {
        res.status(403).send({
          status: 403,
          error: "Forbidden",
        });
        return;
      }

      const segment = await EcoProjectHomepageSegmentModel.findById(id);

      if (!segment) {
        res.status(404).send({
          status: 404,
          error: "Not Found",
        });
        return;
      }

      if (segment.project.toString() !== project._id.toString()) {
        res.status(403).send({
          status: 403,
          error: "Forbidden",
        });
        return;
      }

      segment.title = title;
      segment.content = content;
      segment.type = type;
      segment.pinned = pinned;

      await segment.save();

      res.status(200).send({
        status: 200,
        segment: segment,
      });
    },
  );

  app.delete(
    "/eco-projects/project/homepage/delete-segment",
    {
      config: {
        openapi: {
          description: "Deletes a segment",
          summary: "Delete segment",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_homepage_delete_segment,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          projectId: string;
          id: string;
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

      const { projectId, id } = req.query;

      const project = await EcoProjectModel.findById(projectId);
      if (!project) {
        res.status(404).send({
          status: 404,
          error: "Not Found",
        });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !["ADMINISTRATOR", "EDITOR"].includes(
          project.users.find((u) => u.userId).permissions || "NONE",
        ) &&
        user.role !== "admin"
      ) {
        res.status(403).send({
          status: 403,
          error: "Forbidden",
        });
        return;
      }

      const segment = await EcoProjectHomepageSegmentModel.findById(id);

      if (!segment) {
        res.status(404).send({
          status: 404,
          error: "Not Found",
        });
        return;
      }

      if (segment.project.toString() !== project._id.toString()) {
        res.status(403).send({
          status: 403,
          error: "Forbidden",
        });
        return;
      }

      await segment.deleteOne();

      res.status(200).send({
        status: 200,
        segment: segment,
      });
    },
  );

  app.post(
    "/eco-projects/project/homepage/create-segment",
    {
      config: {
        openapi: {
          description: "Creates a segment",
          summary: "Create segment",
          tags: ["eco-projects"],
          security: [{ jwt: [] }],
        },
      },
      schema: FastifySchemas.eco_projects_homepage_create_segment,
    },
    async (
      req: FastifyRequest<{
        Querystring: {
          id: string;
        };
        Body: {
          title: string;
          type: string;
          content: string;
          pinned?: boolean;
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

      const { id } = req.query;
      const { title, content, type, pinned } = req.body;

      if (!type || !title || !content) {
        res.status(400).send({
          status: 400,
          error: "Bad Request",
        });
        return;
      }

      const project = await EcoProjectModel.findById(id);
      if (!project) {
        res.status(404).send({
          status: 404,
          error: "Not Found",
        });
        return;
      }

      if (
        project.owner.toString() !== user._id.toString() &&
        !["ADMINISTRATOR", "EDITOR"].includes(
          project.users.find((u) => u.userId).permissions || "NONE",
        ) &&
        user.role !== "admin"
      ) {
        res.status(403).send({
          status: 403,
          error: "Forbidden",
        });
        return;
      }
      const segment = await EcoProjectHomepageSegmentModel.create({
        project: project._id,
        title: title,
        content: content,
        type: type,
        pinned: pinned,
      });

      res.status(200).send({
        status: 200,
        segment: segment,
      });
    },
  );
}
