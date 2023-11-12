/**
 * generator/mods/mobile/index.js
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
const createRoute = require("./create-route");

(async () => {
  const response = await prompts({
    type: "select",
    name: "value",
    message: "What do you want to create?",
    choices: [
      {
        title: "A new Route",
        value: "route",
      },
    ],
  });

  if (!response.value) {
    return;
  }

  if (response.value === "route") {
    await createRoute();
  } else {
    console.log("Not implemented yet!");
  }
})();
