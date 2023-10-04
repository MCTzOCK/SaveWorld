/**
 * api/src/types/IResponse.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.08.2023
 *
 */
export interface IResponse {
  status: number;
  payload: {
    [key: string]: any;
  };
}
