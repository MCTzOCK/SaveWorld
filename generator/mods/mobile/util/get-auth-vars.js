/**
 * generator/mods/mobile/util/get-auth-vars.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.10.2023
 *
 */

const prompts = require("prompts");
const path = require("path");

module.exports = async (mobileRoot, routeFile) => {
  let config = {};
  const needsAuth = await prompts({
    type: "confirm",
    name: "value",
    message: "Does this route need authentication?",
  });

  config.needsAuth = needsAuth.value;

  if (config.needsAuth) {
    const authOnlyAdmins = await prompts({
      type: "confirm",
      name: "value",
      message: "Should only admins be able to access this route?",
    });

    config.authOnlyAdmins = authOnlyAdmins.value;
  }

  return {
    NEEDS_AUTH_IMPORT: config.needsAuth
      ? `import { useRedirectForAnon } from "${path
          .relative(
            path.dirname(routeFile),
            path.join(mobileRoot, "src", "hooks", "useRedirectForAnon"),
          )
          .replaceAll("\\", "/")}";`
      : "",
    NEEDS_AUTH: config.needsAuth
      ? "useRedirectForAnon(" +
        (config.authOnlyAdmins ? "{ onlyAdmins: true }" : "") +
        ");\n"
      : "",
  };
};
