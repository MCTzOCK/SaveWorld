/**
 * generator/util/template.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

const prettier = require("prettier");

module.exports = {
  /**
   * @type {function}
   * @param {string} template
   * @param {object} variables
   */
  processTemplate: async (template, variables) => {
    let result = template;

    Object.keys(variables).forEach((key) => {
      // result = result.replace("{#" + key + "}", variables[key]);
      if (key.startsWith("KEEP_")) {
        result = result.replaceAll(
          "//" + key,
          "//" + key + "\n" + variables[key],
        );
      } else {
        result = result.replaceAll("//" + key, variables[key]);
      }
    });

    // const regex = new RegExp("{#[a-zA-Z0-9_]+}", "g");
    const matches = [...result.matchAll(/\/\/[a-zA-Z0-9_]+/g)];

    for (const match of matches) {
      if (typeof match !== "string") continue;

      if (match.startsWith("//KEEP_")) continue;
      result = result.replace(match, "");
    }

    return await prettier.format(result, {
      semi: false,
      parser: "babel-ts",
      comment: true,
    });
  },
};
