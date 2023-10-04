/**
 * api/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.08.2023
 *
 */
import { RESTEnv } from "./RESTEnv";

export { REST } from "./REST";
export { IResponse } from "./types/IResponse";

export function setApiUrl(url: string) {
  RESTEnv.API_URL = url;
}
