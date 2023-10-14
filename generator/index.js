/**
 * generator/index.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

const fs = require("fs");
const path = require("path");
const prompts = require("prompts");

const mods = [];

fs.readdirSync(path.join(__dirname, "mods")).forEach(async (file) => {
  if (!fs.existsSync(path.join(__dirname, "mods", file, "info.js"))) {
    return;
  }

  const mod = require(path.join(__dirname, "mods", file, "info.js"));

  if (!mod || !mod.description) {
    return;
  }

  mods.push({
    description: mod.description,
    path: path.join(__dirname, "mods", file),
  });
});

(async () => {
  const response = await prompts({
    type: "select",
    name: "value",
    message: "What do you want to create?",
    choices: mods.map((mod) => {
      return {
        title: mod.description,
        value: mod,
      };
    }),
  });

  if (!response.value) {
    return;
  }

  await require(response.value.path);
})();
