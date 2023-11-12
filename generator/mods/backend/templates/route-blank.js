/**
 * generator/mods/backend/templates/route-blank.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

const prompts = require("prompts");
const fs = require("fs");
const path = require("path");
const { processTemplate } = require("../../../util/template");
const { getModels } = require("../util/get-models");
const getAuthVars = require("../util/get-auth-vars");

/**
 * @param {object} opts {backendRoot, baseVars, routeTemplate, routeFile}
 * @return {Promise<string>}
 */
module.exports = async (opts) => {
  const config = {};

  const authVars = await getAuthVars(opts.backendRoot, opts.routeFile);

  const models = getModels(opts.backendRoot);

  const modelsToAdd = await prompts({
    type: "multiselect",
    name: "value",
    message: "Which models should be added to this route?",
    choices: models.map((model) => {
      return { title: model, value: model };
    }),
  });

  config.models = modelsToAdd.value;

  let routeContent = await processTemplate(opts.routeTemplate, {
    ...opts.baseVars,
    ...authVars,
    NEEDS_MODEL_IMPORT:
      config.models.length > 0
        ? `${config.models
            .map((model) => {
              return `import ${model} from "${path
                .relative(
                  path.dirname(opts.routeFile),
                  path.join(opts.backendRoot, "src", "models", model),
                )
                .replaceAll("\\", "/")}";\n`;
            })
            .join("")}`
        : "",
  });
  return routeContent;
};
