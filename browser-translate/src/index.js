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
 * @param {string} to The language to translate to
 * @returns {Promise<string>} The translated text
 * @async
 */
async function translate(text, to) {
  const res = await fetch("https://translate.saveworld.one", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      to: to,
    }),
  });

  if (res.status !== 200) {
    return text;
  }

  const data = await res.json();

  return data.text;
}

module.exports = translate;
