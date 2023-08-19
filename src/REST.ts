/**
 * /REST.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */
import makeRequest from "./util/makeRequest";
import { ENDPOINT } from "./env";

export class REST {
  public static Account = {
    login: async (mail: string, password: string, totpCode?: string) => {
      return await makeRequest({
        path: ENDPOINT + "/account/login",
        method: "POST",
        body: {
          email: mail,
          password: password,
          totpCode: totpCode,
        },
      });
    },
    register: async (options: {
      mail: string;
      password: string;
      username: string;
      firstName: string;
      lastName: string;
    }) => {
      return await makeRequest({
        path: ENDPOINT + "/account/register",
        method: "POST",
        body: {
          email: options.mail,
          password: options.password,
          username: options.username,
          firstName: options.firstName,
          lastName: options.lastName,
        },
      });
    },
    verify: async (token: string) => {
      return await makeRequest({
        path: ENDPOINT + "/account/verify-token",
        method: "GET",
        token: token,
      });
    },
  };
}
