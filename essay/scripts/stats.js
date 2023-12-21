/**
 * essay/scripts/stats.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.12.2023
 *
 */

const fs = require("fs");
const path = require("path");

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", ".todo.json")).toString("utf-8"),
);

let totalSections = data.sections.length;
let doneSections = 0;
let totalPages = 0;
let donePages = 0;

for (const page of data.sections) {
  totalPages += page.pages;
  if (page.finished) {
    donePages += page.pages;
    doneSections++;
  }
}

console.table({
  "Total Sections": totalSections,
  "Done Sections": doneSections,
  "Total Pages": totalPages,
  "Done Pages": donePages,
  "Total Progress": Math.round((donePages / totalPages) * 100) + "%",
  "Section Progress": Math.round((doneSections / totalSections) * 100) + "%",
});
