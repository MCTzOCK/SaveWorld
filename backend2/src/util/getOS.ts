/**
 * backend2/src/util/getOS.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */

import * as OneSignal from "@onesignal/node-onesignal";

export const getOS = () => {
  const config = OneSignal.createConfiguration({
    userKey: process.env.ONE_SIGNAL_USER_KEY,
    appKey: process.env.ONE_SIGNAL_APP_KEY,
  });

  const client = new OneSignal.DefaultApi(config);

  return client;
};
