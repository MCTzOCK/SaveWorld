/**
 * mobile/src/util/ai.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.01.2024
 *
 */
import { translateOnlineV3 } from "./online-translate";
import { REST } from "@saveworld/api-js";
import PopupManager from "./PopupManager";
import { $$ } from "../translations/i18n";

export async function aiPrompt(options: {
  prompt: string;
  maxTokens?: number;
}): Promise<string> {
  const res = await fetch("https://ai.saveworld.one/llama", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      prompt: options.prompt,
      max_tokens: options.maxTokens || 100,
    }),
  });

  const j = await res.json();

  const output = j.result;

  return output;
}

export async function promptV2(prompt: string): Promise<string> {
  const res = await REST.AI.predict(
    localStorage.getItem("token") as string,
    prompt,
  );

  if (res.status !== 200) {
    await PopupManager.alertAsync({
      title: $$("control.error"),
      description: res.payload.error,
    });
    return "";
  }

  let output = res.payload.message;

  if (window.language !== "de") {
    output = await translateOnlineV3({
      text: output,
      from: "de",
      to: window.language,
    });
  }

  return output;
}

export async function promptV2Chat(
  prompt: string,
  previousMessages: {
    role: string;
    content: string;
  }[],
): Promise<
  {
    role: string;
    content: string;
  }[]
> {
  const res = await REST.AI.chat(
    localStorage.getItem("token") as string,
    prompt,
    previousMessages,
  );

  if (res.status !== 200) {
    await PopupManager.alertAsync({
      title: $$("control.error"),
      description: res.payload.error,
    });
    return [];
  }
  // TODO: Translate
  return res.payload.chat;
}
