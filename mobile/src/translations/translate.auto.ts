/**
 * mobile/src/translations/translate.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.01.2024
 *
 */

import * as fs from "fs";
import * as path from "path";
import translate from "@iamtraction/google-translate";
import { german } from "./de";

let g = german as any;

const ignoredKeys = ["product.name"];

const fromLang = "de";
const targetLang = process.argv[2] || "en";

(async () => {
  let mod: any = {};
  if (fs.existsSync(path.join(__dirname, `${targetLang}.ts`))) {
    mod = await import(`./${targetLang}`);
  }

  const origKeys = Object.keys(g);
  const keys = Object.keys(mod);

  const newKeys = origKeys.filter((k) => !keys.includes(k));

  const result: any = {};

  for (const key of newKeys) {
    if (ignoredKeys.includes(key)) {
      result[key] = g[key];
      console.log(key, "=> ", g[key]);
    } else {
      const r = await translate(g[key], { from: fromLang, to: targetLang });
      result[key] = r.text;
      console.log(key, "=> ", r.text);
    }
  }

  let content =
    "// This file is auto generated. Any changes might be overwritten.\n\n";

  content += `export const ${targetLang} = ${JSON.stringify(
    result,
    null,
    2,
  )};\n`;

  fs.writeFileSync(path.join(__dirname, `${targetLang}.ts`), content);

  console.log("Done!");
})();
