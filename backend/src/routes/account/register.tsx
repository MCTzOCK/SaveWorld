/**
 * src/routes/account/register.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2023
 *
 */

import { Request, Response } from "express";

import mongoConnect from "../../util/mongo";
import UserModel from "../../models/UserModel";
import { createHash, randomBytes } from "crypto";
import { getTransport } from "../../util/transport";
import UserPreferencesModel from "../../models/UserPreferencesModel";
import { render } from "@react-email/render";
import * as React from "react";
import Register from "../../email-components/Register";

export default async function (req: Request, res: Response) {
  if (req.method !== "POST") {
    res
      .status(405)
      .json({
        error: "Method not allowed",
        status: 405,
      })
      .end();
    return;
  }

  try {
    await mongoConnect();

    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      res
        .status(400)
        .json({
          error: "Please provide all required fields",
          status: 400,
        })
        .end();
      return;
    }

    if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      res
        .status(400)
        .json({
          error: "Please provide a valid email address",
          status: 400,
        })
        .end();
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({
          error: "Please provide a valid password",
          status: 400,
        })
        .end();
      return;
    }

    const activationToken = randomBytes(64).toString("hex");

    const user = await UserModel.create({
      username,
      password: createHash("sha512").update(password).digest("hex"),
      email,
      firstName,
      lastName,
      activationToken,
      active: false,
    });

    const userPreferences = await UserPreferencesModel.create({
      user: user._id,
      interests: [],
    });

    const transport = getTransport();

    await transport.sendMail({
      to: email,
      from: process.env.SMTP_FROM,
      text:
        "Hallo " +
        firstName +
        " " +
        lastName +
        ",\n\n" +
        "vielen Dank für deine Registrierung bei SaveWorld!\n\n" +
        "Bitte aktiviere deinen Account unter folgendem Link: " +
        req.protocol +
        "://" +
        req.hostname +
        "/account/activate?token=" +
        activationToken,
      subject: "Account aktivieren",
      html: render(
        <Register
          firstName={firstName}
          link={
            req.protocol +
            "://" +
            req.hostname +
            "/account/activate?token=" +
            activationToken
          }
        />,
      ),
    });
    res.status(200).json({
      status: 200,
      message: "Please check your email to verify your account.",
    });
  } catch (e) {
    res
      .status(500)
      .json({
        error: e.message,
        status: 500,
      })
      .end();
  }
}
