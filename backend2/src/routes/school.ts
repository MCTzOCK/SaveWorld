/**
 * backend2/src/routes/school.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.03.2024
 *
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isAuth } from "../util/isAuth";
import SchoolClassModel from "../models/SchoolClassModel";
import {
  allow,
  checkRequestPermission,
  DEFAULT_PERMISSIONS,
  disallow,
  getAllPermissions,
} from "../util/permissions";
import { Perms } from "../util/Perms";
import UserModel from "../models/UserModel";
import { createHash } from "crypto";

export default async function aiPlugin(app: FastifyInstance, opts: any) {
  app.get(
    "/school/classes",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Get all classes",
          description: "Get all classes",
          tags: ["school"],
          security: [
            {
              jwt: [],
            },
          ],
        },
      },
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (!checkRequestPermission(user.role, Perms.SCHOOL_CLASSES_RECEIVE, res))
        return;

      const schoolClasses = await SchoolClassModel.find({
        createdBy: user._id,
      });

      res.status(200).send({ schoolClasses });
    },
  );

  app.post(
    "/school/classes",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Create a new class",
          description: "Create a new class",
          tags: ["school"],
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
        Body: {
          name: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (!checkRequestPermission(user.role, Perms.SCHOOL_CLASSES_CREATE, res))
        return;

      const { name } = req.body;

      if (name === undefined || name === null || name === "") {
        res.status(400).send({
          error: "Name is missing",
          status: 400,
        });
        return;
      }
      const newClass = new SchoolClassModel({
        createdBy: user._id,
        name,
      });

      await newClass.save();

      res.status(200).send({ newClass });
    },
  );

  app.get(
    "/school/classes/:id",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Get a class",
          description: "Get a class",
          tags: ["school"],
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
          id: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (!checkRequestPermission(user.role, Perms.SCHOOL_CLASSES_RECEIVE, res))
        return;

      const { id } = req.params;

      const schoolClass = await SchoolClassModel.findOne({
        _id: id,
        createdBy: user._id,
      })
        .populate("students")
        .exec();

      if (!schoolClass) {
        res.status(404).send({
          error: "Class not found",
          status: 404,
        });
        return;
      }

      res.status(200).send({ schoolClass });
    },
  );

  app.post(
    "/school/classes/:id/name",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Update the name of a class",
          description: "Update the name of a class",
          tags: ["school"],
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
        Body: {
          name: string;
        };
        Params: {
          id: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (!checkRequestPermission(user.role, Perms.SCHOOL_CLASSES_UPDATE, res))
        return;

      const { name } = req.body;
      const { id } = req.params;

      if (name === undefined || name === null || name === "") {
        res.status(400).send({
          error: "Name is missing",
          status: 400,
        });
        return;
      }

      const schoolClass = await SchoolClassModel.findOne({
        _id: id,
        createdBy: user._id,
      });

      if (!schoolClass) {
        res.status(404).send({
          error: "Class not found",
          status: 404,
        });
        return;
      }

      schoolClass.name = name;
      schoolClass.markModified("name");
      await schoolClass.save();

      res.status(200).send({ schoolClass });
    },
  );

  app.delete(
    "/school/classes/:id",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Delete a class",
          description: "Delete a class",
          tags: ["school"],
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
          id: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (!checkRequestPermission(user.role, Perms.SCHOOL_CLASSES_DELETE, res))
        return;

      const { id } = req.params;

      const schoolClass = await SchoolClassModel.findOne({
        _id: id,
        createdBy: user._id,
      });

      if (!schoolClass) {
        res.status(404).send({
          error: "Class not found",
          status: 404,
        });
        return;
      }

      for (const student of schoolClass.students) {
        const userMod = await UserModel.findOne({
          _id: student,
        });

        await userMod.deleteOne();
      }

      await schoolClass.deleteOne();

      res.status(200).send({ success: true });
    },
  );

  app.post(
    "/school/classes/:id/students",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Creates multiple students",
          description: "Creates multiple students",
          tags: ["school"],
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
        Body: {
          count: number;
        };
        Params: {
          id: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (
        !checkRequestPermission(
          user.role,
          Perms.SCHOOL_CLASSES_MANAGE_STUDENTS,
          res,
        )
      )
        return;

      const { id } = req.params;

      const schoolClass = await SchoolClassModel.findOne({
        _id: id,
        createdBy: user._id,
      });

      if (!schoolClass) {
        res.status(404).send({
          error: "Class not found",
          status: 404,
        });
        return;
      }

      const { count } = req.body;

      if (count === undefined || count === null || count === 0) {
        res.status(400).send({
          error: "Count is missing",
          status: 400,
        });
        return;
      }

      if (count > 40 || count + schoolClass.students.length > 40) {
        res.status(400).send({
          error:
            "Count is too high: You can have a maximum of 40 students per class",
          status: 400,
        });
        return;
      }

      const students = schoolClass.students;

      for (let i = 0; i < count; i++) {
        const username = "s" + Math.random().toString(36).substring(7);

        const userModel = await UserModel.create({
          role: "student",
          username,
          email: username + "@students.saveworld.one",
          firstName: "Schüler",
          lastName: i.toString() + " (" + schoolClass.name + ")",
          password: createHash("sha256")
            .update(username + Math.random().toString(36))
            .digest("hex"),
          active: true,
        });

        students.push(userModel._id);
      }

      schoolClass.students = students;
      schoolClass.markModified("students");

      await schoolClass.save();

      res.status(200).send({ students });
    },
  );

  app.delete(
    "/school/classes/:id/students/:student",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Delete a student from a class",
          description: "Delete a student from a class",
          tags: ["school"],
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
          id: string;
          student: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (
        !checkRequestPermission(
          user.role,
          Perms.SCHOOL_CLASSES_MANAGE_STUDENTS,
          res,
        )
      )
        return;

      const { id, student } = req.params;

      const schoolClass = await SchoolClassModel.findOne({
        _id: id,
        createdBy: user._id,
      });

      if (!schoolClass) {
        res.status(404).send({
          error: "Class not found",
          status: 404,
        });
        return;
      }

      const students = schoolClass.students;

      const index = students.indexOf(student);

      if (index > -1) {
        const userMod = await UserModel.findOne({
          _id: student,
        });

        if (!userMod) {
          res.status(404).send({
            error: "Student not found",
            status: 404,
          });
          return;
        }

        await userMod.deleteOne();

        students.splice(index, 1);

        schoolClass.students = students;

        await schoolClass.save();

        res.status(200).send({ success: true });

        return;
      }

      res.status(404).send({
        error: "Student not found",
        status: 404,
      });
    },
  );

  app.post(
    "/school/classes/:id/permissions",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Add a permission to a class",
          description: "Add a permission to a class",
          tags: ["school"],
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
        Body: {
          permissions: { permission: string; allowed: boolean }[];
        };
        Params: {
          id: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (
        !checkRequestPermission(
          user.role,
          Perms.SCHOOL_CLASSES_PERMISSIONS,
          res,
        )
      )
        return;

      const { id } = req.params;
      const { permissions } = req.body;

      const schoolClass = await SchoolClassModel.findOne({
        _id: id,
        createdBy: user._id,
      });

      if (!schoolClass) {
        res.status(404).send({
          error: "Class not found",
          status: 404,
        });
        return;
      }

      let cPerms = schoolClass.permissions;

      for (const p of permissions) {
        if (cPerms.find((x) => x.permission === p.permission)) {
          cPerms = cPerms.filter((x) => x.permission !== p.permission);
          cPerms.push(p);
        } else {
          if (DEFAULT_PERMISSIONS["user"].includes(p.permission as Perms)) {
            cPerms.push(p);
          }
        }
      }

      schoolClass.permissions = cPerms;
      schoolClass.markModified("permissions");
      await schoolClass.save();

      let newRole = "student";

      for (const p of cPerms) {
        if (p.allowed) {
          newRole = allow(newRole, p.permission);
        } else {
          newRole = disallow(newRole, p.permission);
        }
      }

      console.log(newRole);

      await updateStudentPermissions(schoolClass, newRole);

      res.status(200).send({ success: true });
    },
  );

  app.get(
    "/school/classes/:id/permissions",
    {
      schema: {},
      config: {
        openapi: {
          summary: "Get all permissions of a class",
          description: "Get all permissions of a class",
          tags: ["school"],
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
          id: string;
        };
      }>,
      res: FastifyReply,
    ) => {
      const { auth, user } = await isAuth(req);

      if (!auth) {
        res.status(401).send({
          error: "Unauthorized",
          status: 401,
        });
        return;
      }

      if (
        !checkRequestPermission(
          user.role,
          Perms.SCHOOL_CLASSES_PERMISSIONS,
          res,
        )
      )
        return;

      const { id } = req.params;

      const schoolClass = await SchoolClassModel.findOne({
        _id: id,
        createdBy: user._id,
      });

      if (!schoolClass) {
        res.status(404).send({
          error: "Class not found",
          status: 404,
        });
        return;
      }

      const perms: {
        permission: string;
        allowed: boolean;
      }[] = [];

      for (const p of schoolClass.permissions) {
        perms.push(p);
      }
      res.status(200).send({ permissions: perms });
    },
  );
}

async function updateStudentPermissions(sClass: any, newRole: string) {
  for (const student of sClass.students) {
    const userMod = await UserModel.findOne({
      _id: student,
    });

    userMod.role = newRole;
    userMod.markModified("role");
    await userMod.save();
  }
}
