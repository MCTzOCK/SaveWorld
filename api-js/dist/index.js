"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setApiUrl = exports.REST = void 0;
/**
 * api/src/index.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.08.2023
 *
 */
const RESTEnv_1 = require("./RESTEnv");
var REST_1 = require("./REST");
Object.defineProperty(exports, "REST", { enumerable: true, get: function () { return REST_1.REST; } });
function setApiUrl(url) {
    RESTEnv_1.RESTEnv.API_URL = url;
}
exports.setApiUrl = setApiUrl;
//# sourceMappingURL=index.js.map