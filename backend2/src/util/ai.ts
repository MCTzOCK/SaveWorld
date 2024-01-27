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

export async function promptWithChat(o: {
  previousMessages: { role: string; content: string }[];
  prompt: string;
  model?: string;
}): Promise<
  {
    role: string;
    content: string;
  }[]
> {
  const messages = [];

  const defaultMessages = [
    {
      role: "system",
      content: "Du bist ein Experte für Nachhaltigkeit!",
    },
    {
      role: "system",
      content: "Halte dich möglichst kurz, maximal 300 Zeichen.",
    },
  ];

  messages.push(...defaultMessages);

  o.previousMessages = o.previousMessages.filter((m) => m.role !== "system");

  messages.push(...o.previousMessages);

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      ...messages,
      {
        role: "user",
        content: o.prompt,
      },
    ],
    model: o.model || "gpt-3.5-turbo-0613",
  });

  const retMessages = [
    ...messages,
    {
      role: "user",
      content: o.prompt,
    },
    chatCompletion.choices[0].message,
  ];

  return retMessages;
}
