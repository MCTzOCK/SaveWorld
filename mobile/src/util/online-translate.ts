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
