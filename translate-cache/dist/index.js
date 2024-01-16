"use strict";
/**
 * translate-cache/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.01.2024
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const process = __importStar(require("process"));
const crypto_1 = require("crypto");
const redis_1 = require("./redis");
const translate_1 = require("./translate");
(async () => {
    const redis = await (0, redis_1.getRedisClient)();
    const fastify = (0, fastify_1.default)({
        logger: true,
        ignoreDuplicateSlashes: true,
        ignoreTrailingSlash: true,
    });
    fastify.register(cors_1.default, {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Accept"],
    });
    fastify.all("/", async (req, res) => {
        res.status(404);
        res.send({
            error: "Not an endpoint",
        });
    });
    fastify.post("/translate", async (req, res) => {
        try {
            const body = req.body;
            if (!body.text || !body.to) {
                res.status(400);
                res.send({
                    error: "Bad Request",
                });
                return;
            }
            const text = body.text;
            const to = body.to;
            const textHash = to + "_" + (0, crypto_1.createHash)("sha256").update(text).digest("hex");
            if (await redis.exists(textHash)) {
                res.status(200);
                res.send({
                    text: await redis.get(textHash),
                });
            }
            else {
                const translated = await (0, translate_1.translateOnlineV2)({
                    text: text,
                    to: to,
                });
                await redis.set(textHash, translated);
                res.status(200);
                res.send({
                    text: translated,
                });
            }
        }
        catch (e) {
            res.status(500);
            res.send({
                error: "Internal Server Error",
                rawError: e,
            });
        }
    });
    fastify.listen(3000, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening on ${address}`);
    });
})();
//# sourceMappingURL=index.js.map