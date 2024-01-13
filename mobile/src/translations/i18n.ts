/**
 * mobile/src/translations/i18n.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.01.2024
 *
 */

const languages = {
  languages: {
    "de-de": {
      displayName: "Deutsch",
      type: "manual",
    },
    "en-us": {
      displayName: "English",
      type: "auto",
    },
  },
};

import { german } from "./de-de";
import { english } from "./en-us";

const currentLanguageSet: { [key: string]: string } = {};

export class I18n {
  public static currentLanguage: string = "de-de";

  public static setLanguage(language: string) {
    I18n.currentLanguage = language;
  }
}

export function __(key: string): string {
  const langset = getLanguageSet(I18n.currentLanguage);

  console.log(langset);

  if (langset[key]) {
    return langset[key];
  }
  return key;
}

export function getLanguages(): typeof languages {
  return languages;
}

function getLanguageSet(language: string): { [key: string]: string } {
  switch (language) {
    case "de-de":
      return german;
    case "en-us":
      return english;
    default:
      return {};
  }
}
