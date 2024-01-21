/**
 * mobile/src/util/ai.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.01.2024
 *
 */

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
