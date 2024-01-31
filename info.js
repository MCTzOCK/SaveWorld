/**
 * /info.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.01.2024
 *
 */

const { execSync } = require("child_process");

const INFO = {
  git: {},
};

const getGitInfo = () => {
  const cwd = process.cwd();

  const gitCommit = execSync("git rev-parse --short HEAD", { cwd }).toString();
  const gitCommits = execSync("git rev-list --count HEAD", { cwd }).toString();
  const gitBranch = execSync("git rev-parse --abbrev-ref HEAD", {
    cwd,
  }).toString();
  const gitLastCommitMessage = execSync("git log -1 --pretty=%B", {
    cwd,
  })
    .toString()
    .replace(/\n/g, "");

  INFO.git.commits = parseInt(gitCommits.replace("\n", ""));
  INFO.git.commit = gitCommit.replace("\n", "").substr(0, 6);
  INFO.git.branch = gitBranch.replace("\n", "");
  INFO.git.lastCommitMessage = gitLastCommitMessage.replace("\n", "");
  // FORMAT: YYYY.MM.DD
  if (INFO.git.lastCommitMessage.match(/(\d{4})\.(\d{2})\.(\d{2})/)) {
    INFO.git.commit = INFO.git.lastCommitMessage;
  }
};

const getSlocInfo = () => {
  const sloc = execSync("node ./sloc.js . --only-total-lines").toString();
  INFO.sloc = parseInt(sloc.replace("\n", ""));
};

getGitInfo();
getSlocInfo();

module.exports = INFO;

/*require("fs").writeFileSync(
  process.argv[2] || "./info.ts",
  "export const INFO = " + JSON.stringify(INFO, null, 2) + ";",
);
*/
