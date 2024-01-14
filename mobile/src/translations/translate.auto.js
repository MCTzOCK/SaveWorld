/**
 * mobile/src/translations/translate.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.01.2024
 *
 */

const fs = require("fs");
const path = require("path");
const translate = require("@iamtraction/google-translate");

if (!fs.existsSync(path.join(__dirname, "temp", "de-de.json"))) {
  console.log("ERROR: No translation file found (./temp/de-de.json)!");
  process.exit(1);
}

const translations = JSON.parse(
  fs.readFileSync(path.join(__dirname, "temp", "de-de.json")).toString(),
);

const ignoredKeys = ["product.name"];

const fromLang = "de";
const targetLang = process.argv[2] || "en";

(async () => {
  const result = {};
  for (const key of Object.keys(translations)) {
    if (ignoredKeys.includes(key)) {
      result[key] = translations[key];
      continue;
    }
    try {
      const res = await translate(translations[key], {
        from: fromLang,
        to: targetLang,
      });
      result[key] = res.text;
      console.log(key, "=>", res.text);
    } catch (e) {
      console.log("Could not translate", key, e);
      result[key] = translations[key];
    }
  }

  fs.writeFileSync(
    path.join(__dirname, "temp", `${targetLang}.json`),
    JSON.stringify(result, null, 2),
  );

  console.log(
    "Done! Please manually check the translations and add them to the i18n class.",
  );
})();
