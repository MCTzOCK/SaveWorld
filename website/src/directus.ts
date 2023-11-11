/**
 * website/src/directus.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */
import { createDirectus, rest } from "@directus/sdk";

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
  }>("https://content.saveworld.one").with(rest());
};
