/**
 * /env.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */
import GhostContentAPI from "@tryghost/content-api";
import { createDirectus, rest } from "@directus/sdk";

export const ENDPOINT = import.meta.env.VITE_ENDPOINT;
export const GHOST_ENDPOINT = import.meta.env.VITE_GHOST_ENDPOINT;
export const ONE_SIGNAL_APP_ID = import.meta.env.VITE_ONE_SIGNAL_APP_ID;
export const NOMINATIM_ENDPOINT = import.meta.env.VITE_NOMINATIM_ENDPOINT;
export const APPLE_MAP_KIT_TOKEN = import.meta.env.VITE_APPLE_MAP_KIT_TOKEN;
export const GHOST_CONTENT_API_KEY = import.meta.env.VITE_GHOST_CONTENT_API_KEY;
export const DIRECTUS_ENDPOINT = import.meta.env.VITE_DIRECTUS_ENDPOINT;
export const FLAGSMITH_ENDPOINT = import.meta.env.VITE_FLAGSMITH_ENDPOINT;

export const getGhostContentApi = () => {
  return new GhostContentAPI({
    url: GHOST_ENDPOINT,
    key: GHOST_CONTENT_API_KEY,
    version: "v5.0",
  });
};

export const getDirectusApi = () => {
  return createDirectus<{
    Posts: {
      id: string;
      user_created: string;
      date_created: string;
      feature_image: string;
      feature_image_author: string;
      title: string;
      markdown: string;
      tags: string;
    }[];
    Quizzes: {
      id: string;
      user_created: string;
      date_created: string;
      question: string;
      answer_1: string;
      answer_2: string;
      answer_3: string;
      answer_4: string;
      image: string;
      correct: number;
    }[];
  }>(DIRECTUS_ENDPOINT).with(rest());
};
