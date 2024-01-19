/**
 * /sloc-components.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.12.2023
 *
 */
const child_process = require("child_process");

const old_console_log = console.log;

const components = {
  "./backend": 0,
  "./backend2": 0,
  "./mobile": 0,
  "./generator": 0,
  "./website": 0,
  "./essay": 0,
  "./api-js": 0,
  "./translate-server": 0,
  "./translate-cache": 0,
  "./browser-translate": 0,
  total: 0,
};

for (const key in components) {
  if (key == "total") continue;
  const output = child_process.execSync(
    `node ./sloc.js ${key} --only-total-lines`,
    {
      stdio: "pipe",
    },
  );
  components[key] = parseInt(output.toString().split("\n")[0]);
}

components.total = Object.values(components).reduce((a, b) => a + b);

console.table(components);
