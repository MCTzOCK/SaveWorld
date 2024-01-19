/**
 * translate-cache/src/translate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.01.2024
 *
 */

export async function translateOnlineV2(options: {
  text: string;
  to: string;
  from?: string;
  format?: string;
}) {
  if (!options.from) {
    options.from = "auto";
  }
  if (!options.format) {
    options.format = "text";
  }

  const body = {
    q: options.text,
    source: options.from,
    target: options.to,
    format: options.format,
    api_key: "",
  };

  const res = await fetch("https://translate.ben-siebert.com/translate", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const j = await res.json();
  return j.translatedText;
}
