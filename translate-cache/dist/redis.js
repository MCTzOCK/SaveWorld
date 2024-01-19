"use strict";
/**
 * translate-cache/src/redis.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.01.2024
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = void 0;
const redis_1 = require("redis");
async function getRedisClient() {
    const client = (0, redis_1.createClient)({
        url: "redis://app0.coolescoden.de:6379",
    });
    client.on("error", (err) => {
        console.error("REDIS Error", err);
    });
    await client.connect();
    return client;
}
exports.getRedisClient = getRedisClient;
//# sourceMappingURL=redis.js.map