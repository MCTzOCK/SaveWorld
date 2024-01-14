/**
 * mobile/src/util/online-translate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.01.2024
 *
 */
import { TRANSLATE_SERVER } from "../env";

export async function translateOnline(text: string, to: string) {
  const res = await fetch(TRANSLATE_SERVER, {
    method: "POST",
    body: JSON.stringify({
      text,
      to,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 200) {
    return (await res.json()).text;
  } else {
    return text;
  }
}
