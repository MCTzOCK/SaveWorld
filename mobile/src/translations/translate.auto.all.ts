/**
 * mobile/src/translations/translate.auto.all.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.01.2024
 *
 */

import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

const languages = [];

const files = fs.readdirSync(path.join(__dirname));

for (const file of files) {
  if (file.endsWith(".ts") && file.length === 5) {
    if (file === "de.ts") continue;
    languages.push(file.replace(".ts", ""));
  }
}

for (const lang of languages) {
  console.log("Translating", lang);
  execSync(`tsx translate.auto.ts ${lang}`);
}
