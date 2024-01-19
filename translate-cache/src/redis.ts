/**
 * translate-cache/src/redis.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.01.2024
 *
 */

import { createClient } from "redis";

export async function getRedisClient() {
  const client = createClient({
    url: "redis://app0.coolescoden.de:6379",
  });

  client.on("error", (err) => {
    console.error("REDIS Error", err);
  });

  await client.connect();
  return client;
}
