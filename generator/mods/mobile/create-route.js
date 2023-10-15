/**
 * generator/mods/mobile/create-route.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.10.2023
 *
 */

const fs = require("fs");
const path = require("path");
const prompts = require("prompts");
const { processTemplate } = require("../../util/template");

module.exports = async function () {
  const mobileRoot = path.join(process.cwd(), "mobile");

  const config = {
    routePath: "",
  };

  if (!fs.existsSync(mobileRoot)) {
    console.log(
      "[FATAL] Mobile not found! Please make sure you are in the root directory of the project and run the generator using `node generator`.",
    );
    return;
  }

  const routeName = await prompts({
    type: "text",
    name: "value",
    message: "What is the path of the route?",
  });

  if (!routeName.value) {
    return;
  }

  config.routePath = routeName.value;

  const routeFile = path.join(
    mobileRoot,
    "src",
    "pages",
    config.routePath + ".tsx",
  );

  if (fs.existsSync(routeFile)) {
    console.log("[FATAL] Route already exists!");
    return;
  }

  const templateList = fs
    .readdirSync(path.join(__dirname, "templates"))
    .filter((file) => {
      return file.endsWith(".ts.bstpl") && file.startsWith("route-");
    })
    .map((file) => {
      return file.replace(".ts.bstpl", "").replace("route-", "");
    });

  const template = await prompts({
    type: "select",
    name: "value",
    message: "What template do you want to use?",
    choices: templateList.map((template) => {
      return {
        title: template,
        value: template,
      };
    }),
  });

  if (!template.value) {
    return;
  }

  config.templatePath = template.value;

  const baseVars = {
    date: new Date().toLocaleDateString(),
    path: path
      .relative(
        process.cwd(),
        path.join(mobileRoot, "src", "pages", config.routePath + ".ts"),
      )
      .replaceAll("\\", "/"),
  };

  const output = await require(path.join(
    __dirname,
    "templates",
    "route-" + config.templatePath.replace(".bstpl", "") + ".js",
  ))({
    mobileRoot: mobileRoot,
    baseVars,
    routeTemplate: fs.readFileSync(
      path.join(
        __dirname,
        "templates",
        "route-" + config.templatePath.replace(".bstpl", "") + ".ts.bstpl",
      ),
      "utf-8",
    ),
    routeFile,
  });

  if (!fs.existsSync(path.dirname(routeFile))) {
    fs.mkdirSync(path.dirname(routeFile), { recursive: true });
  }

  fs.writeFileSync(routeFile, output);

  console.log("Route created at " + routeFile + "!");
};
