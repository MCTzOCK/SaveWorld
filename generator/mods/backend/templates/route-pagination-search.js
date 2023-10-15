/**
 * generator/mods/backend/templates/route-pagination-search.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.10.2023
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

  const model = await prompts({
    type: "select",
    name: "value",
    message: "Which model should be added to this route?",
    choices: models.map((model) => {
      return { title: model, value: model };
    }),
  });

  const pageSize = await prompts({
    type: "number",
    name: "value",
    message: "How many items should be returned per page?",
  });

  config.pageSize = pageSize.value;

  const fieldsToSearch = await prompts({
    type: "list",
    name: "value",
    message: "Which fields should be searched? (separated by comma)",
  });

  config.fieldsToSearch = fieldsToSearch.value;

  const searchQuery =
    "$or: [\n" +
    fieldsToSearch.value
      .map((field) => {
        return `    {${field}: {$regex: search, $options: "i"}}`;
      })
      .join(",\n") +
    "\n]";

  const vars = {
    ...authVars,
    ...opts.baseVars,
    PAGE_SIZE: config.pageSize,
    MODEL_NAME: model.value,
    MODEL_PATH: path
      .relative(
        path.dirname(opts.routeFile),
        path.join(opts.backendRoot, "src", "models", model.value),
      )
      .replaceAll("\\", "/"),
    SEARCH_QUERY: searchQuery,
  };

  let routeContent = await processTemplate(opts.routeTemplate, vars);

  return routeContent;
};
