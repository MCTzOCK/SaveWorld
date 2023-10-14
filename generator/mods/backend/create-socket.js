/**
 * generator/mods/backend/create-socket.js
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
const { processTemplate } = require("../../util/template");

module.exports = async function () {
  const backendRoot = path.join(process.cwd(), "backend");

  const config = {
    routePath: "",
  };

  if (!fs.existsSync(backendRoot)) {
    console.log(
      "[FATAL] Backend not found! Please make sure you are in the root directory of the project and run the generator using `node generator`.",
    );
    return;
  }

  const channelClassName = await prompts({
    type: "text",
    name: "value",
    message: "What is the name of the channel class?",
  });

  if (!channelClassName.value) {
    return;
  }

  config.channelClassName = channelClassName.value;

  const channelName = await prompts({
    type: "text",
    name: "value",
    message: "What is the name of the channel? (e.g: sw:chats.create)",
  });

  if (!channelName.value) {
    return;
  }

  config.channelName = channelName.value;

  const channelFilePath = path.join(
    backendRoot,
    "src",
    "socket",
    "channels",
    config.channelClassName + ".ts",
  );

  if (fs.existsSync(channelFilePath)) {
    console.log("[FATAL] Channel class name is already taken!");
    return;
  }

  const templateContent = fs.readFileSync(
    path.join(__dirname, "templates", "socket.ts.bstpl"),
    "utf8",
  );

  const content = await processTemplate(templateContent, {
    date: new Date().toLocaleDateString(),
    path: path
      .relative(
        process.cwd(),
        path.join(backendRoot, "src", "routes", config.routePath + ".ts"),
      )
      .replaceAll("\\", "/"),
    CHANNEL_CLASS_NAME: config.channelClassName,
    CHANNEL_NAME: config.channelName,
  });

  fs.writeFileSync(channelFilePath, content);

  const appFilePath = path.join(backendRoot, "src", "app.ts");

  const appFileContent = fs.readFileSync(appFilePath, "utf8");

  const newAppFileContent = await processTemplate(appFileContent, {
    KEEP_IMPORT_ADD_POINT: `import ${config.channelClassName} from "./socket/channels/${config.channelClassName}";`,
    KEEP_CHANNEL_ADD_POINT: `new ${config.channelClassName}(socket, "${config.channelName}").register();`,
  });

  fs.writeFileSync(appFilePath, newAppFileContent);

  console.log("Socket Channel created at " + channelFilePath + "!");
};
