/**
 * browser-translate/src/index.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.01.2024
 *
 */

/**
 * Translates the given text
 * @param {string} text The text to translate
 * @param {string} from The language to translate from
 * @returns {Promise<string>} The translated text
 */
async function translate(text, from) {
  const res = await fetch("https://translate.saveworld.one", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      from: from,
    }),
  });

  if (res.status !== 200) {
    return text;
  }

  const data = await res.json();

  return data.text;
}

module.exports = translate;
