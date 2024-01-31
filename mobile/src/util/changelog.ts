/**
 * mobile/src/util/changelog.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.01.2024
 *
 */
import { INFO } from "../local-depl-info";
import { getDirectusApi } from "../env";
import { readItem, readItems } from "@directus/sdk";
import { translateOnlineV3 } from "./online-translate";

export async function getChangelog(): Promise<{
  hasChangelog: boolean;
  changelog: string;
}> {
  const version = INFO.git.commit;

  const post = await getDirectusApi().request(readItem("Changelog", version));

  if (post) {
    let changelog = post.changes;

    if (window.language !== "de") {
      changelog = await translateOnlineV3({
        text: changelog,
        to: window.language,
      });
    }

    return { hasChangelog: true, changelog };
  } else {
    return { hasChangelog: false, changelog: "" };
  }
}

export function shouldShowChangelog(): boolean {
  return localStorage.getItem("changelog") !== INFO.git.commit;
}

export function setChangelogShown() {
  localStorage.setItem("changelog", INFO.git.commit);
}
