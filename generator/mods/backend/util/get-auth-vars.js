/**
 * generator/mods/backend/get-auth-vars.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

const prompts = require("prompts");
const path = require("path");

module.exports = async (backendRoot, routeFile) => {
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
      ? `import { isAuthenticated } from "${path
          .relative(
            path.dirname(routeFile),
            path.join(backendRoot, "src", "util", "isAuthenticated"),
          )
          .replaceAll("\\", "/")}";`
      : "",
    NEEDS_AUTH: config.needsAuth
      ? "const { auth, user } = await isAuthenticated(req, res);\n\n" +
        "if(!auth) {\n" +
        "\tres.status(401).json({error: 'Unauthorized'});\n" +
        "\treturn;\n" +
        "}" +
        (config.authOnlyAdmins
          ? "\n\nif(user.role !== 'admin') {\n" +
            "\tres.status(401).json({error: 'Unauthorized'});\n" +
            "\treturn;\n" +
            "}"
          : "")
      : "",
  };
};
