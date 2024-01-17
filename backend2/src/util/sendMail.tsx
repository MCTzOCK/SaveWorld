/**
 * backend2/src/util/sendMail.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */

import * as React from "react";
import { getTransport } from "./transport";
import { render } from "@react-email/render";
import Register from "../email-components/Register";

export async function sendRegisterEmail(options: {
  to: string;
  firstName: string;
  lastName: string;
  protocol: string;
  hostname: string;
  activationToken: string;
}) {
  const transport = getTransport();
  await transport.sendMail({
    to: options.to,
    from: process.env.SMTP_FROM,
    text:
      "Hallo " +
      options.firstName +
      " " +
      options.lastName +
      ",\n\n" +
      "vielen Dank für deine Registrierung bei SaveWorld!\n\n" +
      "Bitte aktiviere deinen Account unter folgendem Link: " +
      options.protocol +
      "://" +
      options.hostname +
      "/account/activate?token=" +
      options.activationToken,
    subject: "Account aktivieren",
    html: render(
      <Register
        firstName={options.firstName}
        link={
          options.protocol +
          "://" +
          options.hostname +
          "/account/activate?token=" +
          options.activationToken
        }
      />,
    ),
  });
}
