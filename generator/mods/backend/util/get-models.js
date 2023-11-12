/**
 * generator/mods/backend/util/get-models.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

const fs = require("fs");
const path = require("path");
module.exports = {
  getModels: (backendPath) => {
    const models = [];

    fs.readdirSync(path.join(backendPath, "src", "models")).forEach((file) => {
      models.push(file.replace(".ts", ""));
    });

    return models;
  },
};
