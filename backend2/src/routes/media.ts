/**
 * backend2/src/routes/media.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */

import * as formidable from "formidable";
import { FastifySchemas } from "../Schemas";
import { FastifyInstance, FastifyRequest } from "fastify";
import { randomBytes } from "crypto";
import { getMinio } from "../util/getMinio";
import * as os from "os";
import { readFileSync } from "fs";
import UserPreferencesModel from "../models/UserPreferencesModel";
import UserModel from "../models/UserModel";

export default async function accountPlugin(app: FastifyInstance, opts: any) {
  app.post(
    "/media/upload",
    {
      config: {
        openapi: {
          description: "Uploads a file to the media server",
          summary: "Upload file",
          tags: ["media"],
          security: [],
        },
      },
      schema: {},
    },
    async (req, res) => {
      const data = await req.file();

      const minio = getMinio();

      const mimeType = data.mimetype;
      const fileName = data.filename;

      let objectName =
        randomBytes(64).toString("hex") + "." + fileName.split(".").pop();

      await minio.putObject(
        process.env.MINIO_MEDIA_BUCKET,
        objectName,
        data.file,
        {
          "Content-Type": mimeType,
          "X-Original-Filename": fileName,
        },
      );

      res.status(200).send({
        status: 200,
        message: "File uploaded successfully",
        data: {
          url: "/media/file/" + objectName,
        },
      });
    },
  );

  app.get(
    "/media/file/:objectname",
    {
      config: {
        openapi: {
          description: "Returns the requested file",
          summary: "Receive file",
          tags: ["media"],
          security: [],
        },
      },
      schema: {},
    },
    async (
      req: FastifyRequest<{
        Params: {
          objectname: string;
        };
      }>,
      res,
    ) => {
      const minio = getMinio();

      const objectName = req.params.objectname;

      await minio.fGetObject(
        process.env.MINIO_MEDIA_BUCKET,
        objectName,
        os.tmpdir() + "/" + objectName,
      );

      const stat = await minio.statObject(
        process.env.MINIO_MEDIA_BUCKET,
        objectName,
      );

      res.header("Content-Type", stat["content-type"]);
      res.send(readFileSync(os.tmpdir() + "/" + objectName));
    },
  );

  app.get(
    "/media/profile-picture/:id",
    {
      config: {
        openapi: {
          description: "Return the users profile picture",
          summary: "Receive PfP",
          tags: ["media"],
          security: [],
        },
      },
      schema: {},
    },
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
        };
      }>,
      res,
    ) => {
      const id = req.params.id;
      const userPreferences = await UserPreferencesModel.findOne({ user: id });
      if (!userPreferences) {
        res.redirect("/public/blank-profile-picture-973460_1280.png");
        return;
      }

      res.redirect(userPreferences.picture);
    },
  );

  app.get(
    "/media/profile-picture-username/:username",
    {
      config: {
        openapi: {
          description: "Return the users profile picture",
          summary: "Receive PfP (by username)",
          tags: ["media"],
          security: [],
        },
      },
      schema: {},
    },
    async (
      req: FastifyRequest<{
        Params: {
          username: string;
        };
      }>,
      res,
    ) => {
      const username = req.params.username;

      const userMod = await UserModel.findOne({
        username: username,
      });

      if (!userMod) {
        res.redirect("/public/blank-profile-picture-973460_1280.png");
        return;
      }
      const userPreferences = await UserPreferencesModel.findOne({
        user: userMod._id,
      });

      if (!userPreferences) {
        res.redirect("/public/blank-profile-picture-973460_1280.png");
        return;
      }

      res.redirect(userPreferences.picture);
    },
  );
}
