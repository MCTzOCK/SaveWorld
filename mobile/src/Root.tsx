/**
 * mobile/src/Root.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.01.2024
 *
 */

import * as React from "react";
import { FlagsmithProvider } from "flagsmith/react";
import flagsmith from "flagsmith";
import { FLAGSMITH_ENDPOINT, FLAGSMITH_ENVIRONMENT_ID } from "./env";
import App from "./App";

export default function Root(props: { children: any }) {
  return (
    <>
      <React.StrictMode>
        <FlagsmithProvider
          flagsmith={flagsmith}
          options={{
            environmentID: FLAGSMITH_ENVIRONMENT_ID,
            api: FLAGSMITH_ENDPOINT,
            defaultFlags: {
              ai_helper: {
                enabled: true,
              },
              news: {
                enabled: true,
              },
              community: {
                enabled: true,
              },
              eco_projects: {
                enabled: true,
              },
              quizzes: {
                enabled: true,
              },
              tools_co2_calc: {
                enabled: true,
              },
              tracker: {
                enabled: true,
              },
              videos: {
                enabled: true,
              },
              sustainability_articles: {
                enabled: true,
              },
              video_category_channels: {
                enabled: true,
              },
              recipes: {
                enabled: true,
              },
              eatingplans: {
                enabled: true,
              },
            },
          }}
        >
          {props.children}
        </FlagsmithProvider>
      </React.StrictMode>
    </>
  );
}
