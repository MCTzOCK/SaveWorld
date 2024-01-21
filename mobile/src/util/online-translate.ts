/**
 * mobile/src/util/online-translate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.01.2024
 *
 */
import translate from "@saveworld/browser-translate";

export async function translateOnline(text: string, to: string) {
  return await translate(text, to);
}

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

export async function translateOnlineV3(options: {
  text: string;
  to: string;
  from?: string;
}) {
  const body = {
    text: options.text,
    to: options.to,
    from: options.from || "de",
  };

  const res = await fetch("https://translate-cache.ben-siebert.com/translate", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const j = await res.json();

  return j.text;
}
