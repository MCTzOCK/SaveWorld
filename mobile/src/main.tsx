import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setApiUrl } from "@saveworld/api-js";
import { ENDPOINT, FLAGSMITH_ENDPOINT, FLAGSMITH_ENVIRONMENT_ID } from "./env";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";

setApiUrl(ENDPOINT);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <FlagsmithProvider
      flagsmith={flagsmith}
      options={{
        environmentID: FLAGSMITH_ENVIRONMENT_ID,
        api: FLAGSMITH_ENDPOINT,
      }}
    >
      <App />
    </FlagsmithProvider>
  </React.StrictMode>,
);
