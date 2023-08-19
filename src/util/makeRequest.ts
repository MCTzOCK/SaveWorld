/**
 * /makeRequest.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */
import { IResponse } from "./IResponse";

export default async function makeRequest(options: {
  path: string;
  body?: object;
  token?: string;
  headers?: object;
  method:
    | "GET"
    | "POST"
    | "DELETE"
    | "PUT"
    | "HEAD"
    | "PATCH"
    | "OPTIONS"
    | "CONNECT"
    | "TRACE";
}): Promise<IResponse> {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
    "X-Executed-By": "@saveworld/rest:makeRequest",
  };

  if (options.token) {
    headers["X-AUTH"] = options.token;
  }

  if (options.headers) {
    Object.keys(options.headers).forEach((customHeader) => {
      // @ts-ignore
      headers[customHeader] = options.headers[customHeader];
    });
  }

  const res = await fetch(options.path, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : null,
  });

  const payload = await res.json();

  return {
    status: res.status,
    payload: payload,
  };
}
