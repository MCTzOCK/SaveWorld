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
  public static Admin = {
    stats: async (token: string) => {
      return await makeRequest({
        path: ENDPOINT + "/admin/stats",
        method: "GET",
        token: token,
      });
    },
    users: async (token: string, id?: string) => {
      return await makeRequest({
        path: ENDPOINT + "/admin/users" + (id ? "?id=" + id : ""),
        method: "GET",
        token: token,
      });
    },
    updateUser: async (token: string, id: string, update: any) => {
      return await makeRequest({
        path: ENDPOINT + "/admin/users/update?id=" + id,
        method: "POST",
        token: token,
        body: {
          update: update,
        },
      });
    },
  };

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
    update: async (
      token: string,
      options: {
        mail?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        totpActive?: boolean;
        totpCode?: string;
      },
    ) => {
      return await makeRequest({
        path: ENDPOINT + "/account/update",
        method: "POST",
        token: token,
        body: {
          update: {
            email: options.mail,
            password: options.password,
            firstName: options.firstName,
            lastName: options.lastName,
            totpActive: options.totpActive,
          },
          totpCode: options.totpCode,
        },
      });
    },
    delete: async (token: string) => {
      return await makeRequest({
        path: ENDPOINT + "/account/delete",
        method: "DELETE",
        token: token,
      });
    },
  };
}
