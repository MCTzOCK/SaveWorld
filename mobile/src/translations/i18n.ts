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
    de: {
      displayName: "Deutsch",
      type: "manual",
      cc: "de",
    },
    en: {
      displayName: "English",
      type: "manual",
      cc: "gb",
    },
    es: {
      displayName: "Español",
      type: "auto",
      cc: "es",
    },
    fr: {
      displayName: "Français",
      type: "auto",
      cc: "fr",
    },
    nl: {
      displayName: "Nederlands",
      type: "auto",
      cc: "nl",
    },
    pt: {
      displayName: "Português",
      type: "auto",
      cc: "pt",
    },
    it: {
      displayName: "Italiano",
      type: "auto",
      cc: "it",
    },
    cn: {
      displayName: "中文",
      type: "auto",
      cc: "cn",
    },
  },
};

import { german } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { cn } from "./cn";
import { pt } from "./pt";
import { it } from "./it";
import { nl } from "./nl";

type Keys = keyof typeof german;

const currentLanguageSet: { [key: string]: string } = {};

export class I18n {
  public static currentLanguage: string = "";

  public static setLanguage(language: string) {
    I18n.currentLanguage = language;
  }
}

export function $$(key: Keys, ...args: string[]): string {
  const langset = getLanguageSet(window.language);

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
    case "de":
      return german;
    case "en":
      return en;
    case "es":
      return es;
    case "fr":
      return fr;
    case "cn":
      return cn;
    case "pt":
      return pt;
    case "it":
      return it;
    case "nl":
      return nl;
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
