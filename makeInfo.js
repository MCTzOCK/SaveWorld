/**
 * /makeInfo.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.01.2024
 *
 */

const { execSync } = require("child_process");
const { join } = require("path");
const INFO = require("./info");
const fs = require("fs");

const file_name = "local-depl-info.ts";

const outputs = ["./backend2/src", "./website/src", "./mobile/src"];

for (const o of outputs) {
  fs.writeFileSync(
    join(o, file_name),
    `export const INFO = ${JSON.stringify(INFO, null, 2)};`,
  );
}
