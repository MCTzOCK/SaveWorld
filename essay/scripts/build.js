/**
 * essay/scripts/build.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.12.2023
 *
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { program } = require("commander");
const rimraf = require("rimraf");

const root = path.join(__dirname, "..");

program
  .option("-t, --target <target>", "Target", "jufo")
  .option("-d, --docx", "Export to docx", false);

program.parse();

const options = program.opts();

if (!fs.existsSync(path.join(root, "src", `target_${options.target}.tex`))) {
  console.log(`Target ${options.target} not found!`);
  process.exit(1);
}

const job_name = `SaveWorld_${options.target}`;
/*
const job_name = `SaveWorld_${options.target}_${new Date().toLocaleDateString(
  "de-DE",
)}-${new Date()
  .toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  .replaceAll(":", ".")}`;
*/

if (fs.existsSync(path.join(root, "src", "target.tex"))) {
  fs.unlinkSync(path.join(root, "src", "target.tex"));
}
fs.copyFileSync(
  path.join(root, "src", `target_${options.target}.tex`),
  path.join(root, "src", "target.tex"),
);

clean();
buildLatex();
buildBib();
buildLatex();
buildLatex();

if (options.docx) {
  createDocx();
}

console.log("Done! Target PDF file: pdf/" + job_name + ".pdf");

function buildLatex() {
  execSync(
    `pdflatex -output-directory ../pdf -job-name "${job_name}" main.tex`,
    {
      cwd: path.join(root, "src"),
      stdio: "inherit",
    },
  );
}

function buildBib() {
  execSync(`biber ../pdf/${job_name}`, {
    cwd: path.join(root, "src"),
    stdio: "inherit",
  });
}

function clean() {
  rimraf.rimrafSync(path.join(root, "pdf"));
}

function createDocx() {
  execSync(`node scripts/convert-docx.js -j ${job_name}`, {
    stdio: "inherit",
  });
}
