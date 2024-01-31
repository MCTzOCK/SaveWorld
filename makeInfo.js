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

const file_name = "local-depl-info.ts";

const outputs = ["./backend2/src", "./website/src"];

for (const o of outputs) {
  execSync(`node ./info.js ${join(o, file_name)}`);
}
