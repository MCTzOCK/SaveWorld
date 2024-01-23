/**
 * backend2/src/util/openai.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.01.2024
 *
 */

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_TOKEN"],
});

export async function prompt(o: { model?: string; prompt: string }) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "Du bist ein Experte für Nachhaltigkeit!",
      },
      {
        role: "system",
        content: "Halte dich möglichst kurz, maximal 300 Zeichen.",
      },
      {
        role: "user",
        content: o.prompt,
      },
    ],
    model: o.model || "gpt-3.5-turbo-0613",
  });

  return chatCompletion.choices[0].message.content;
}
