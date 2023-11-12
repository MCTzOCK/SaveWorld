/**
 * generator/mods/mobile/templates/route-blank.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.10.2023
 *
 */
const getAuthVars = require("../util/get-auth-vars");
const { processTemplate } = require("../../../util/template");
const prompts = require("prompts");
const path = require("path");

/**
 * @param {object} opts {mobileRoot, baseVars, routeTemplate, routeFile}
 * @return {Promise<string>}
 */
module.exports = async (opts) => {
  const config = {};

  const authVars = await getAuthVars(opts.mobileRoot, opts.routeFile);

  const routeTitle = await prompts({
    type: "text",
    name: "value",
    message: "What is the title of the route?",
  });

  return await processTemplate(opts.routeTemplate, {
    ...opts.baseVars,
    ...authVars,
    ROUTE_NAME: opts.routeFile
      .replaceAll("\\", "/")
      .split("/")
      .slice(-1)[0]
      .split(".")[0],
    ROUTE_TITLE: routeTitle.value || "Neue Seite",
    PAGE_IMPORT: `import Page from "${path
      .relative(
        path.dirname(opts.routeFile),
        path.join(opts.mobileRoot, "src", "components", "Page"),
      )
      .replaceAll("\\", "/")
      .replaceAll(".tsx", "")}"`,
  });
};
