/**
 * mobile/src/translations/compare.csv.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.01.2024
 *
 */

import * as fs from "fs";
import * as path from "path";
import { german } from "./de";
import { translateOnlineV3 } from "../util/online-translate";

let g = german as any;

const ignoredKeys = ["product.name"];

const fromLang = "de";
const targetLang = process.argv[2] || "en";

(async () => {
  let mod: any = {};
  if (fs.existsSync(path.join(__dirname, `${targetLang}.ts`))) {
    mod = (await import(`./${targetLang}`))[targetLang];
  }

  let csv = "key;de;" + targetLang + "\n";

  for (const key of Object.keys(g)) {
    if (ignoredKeys.includes(key)) {
      csv += key + ";" + g[key] + ";" + mod[key] + "\n";
    } else {
      csv +=
        key +
        ";" +
        g[key] +
        ";" +
        (await translateOnlineV3({
          text: g[key],
          to: targetLang,
        })) +
        "\n";
    }
  }

  fs.writeFileSync(path.join(__dirname, "de-" + targetLang + ".csv"), csv);
})();
