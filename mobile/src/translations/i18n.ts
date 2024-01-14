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

type Keys = keyof typeof german;

const currentLanguageSet: { [key: string]: string } = {};

export class I18n {
  public static currentLanguage: string = "en-us";

  public static setLanguage(language: string) {
    I18n.currentLanguage = language;
  }
}

export function __(key: Keys, ...args: string[]): string {
  const langset = getLanguageSet(I18n.currentLanguage);

  if (langset[key]) {
    let v: string = langset[key];
    args.forEach((arg, i) => {
      v = v.replace("%" + i, arg) as any;
    });

    return v;
  }
  return key;
}

export function getLanguages(): typeof languages {
  return languages;
}

function getLanguageSet(language: string): Record<Keys, string> {
  switch (language) {
    case "de-de":
      return german;
    case "en-us":
      // todo return english;
      return getEmptyLanguageSet();
    default:
      return getEmptyLanguageSet();
  }
}

function getEmptyLanguageSet(): Record<Keys, string> {
  const langset = german;
  const emptyLangset: Record<Keys, string> = {} as any;
  Object.keys(langset).forEach((key) => {
    emptyLangset[key as Keys] = "" as any;
  });
  return emptyLangset;
}
