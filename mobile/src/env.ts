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

export const ENDPOINT = import.meta.env.VITE_ENDPOINT;
export const GHOST_ENDPOINT = import.meta.env.VITE_GHOST_ENDPOINT;
export const ONE_SIGNAL_APP_ID = import.meta.env.VITE_ONE_SIGNAL_APP_ID;
export const NOMINATIM_ENDPOINT = import.meta.env.VITE_NOMINATIM_ENDPOINT;
export const APPLE_MAP_KIT_TOKEN = import.meta.env.VITE_APPLE_MAP_KIT_TOKEN;
export const GHOST_CONTENT_API_KEY = import.meta.env.VITE_GHOST_CONTENT_API_KEY;

export const getGhostContentApi = () => {
  return new GhostContentAPI({
    url: GHOST_ENDPOINT,
    key: GHOST_CONTENT_API_KEY,
    version: "v5.0",
  });
};
