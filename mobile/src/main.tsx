import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setApiUrl } from "@saveworld/api-js";
import { ENDPOINT } from "./env";

setApiUrl(ENDPOINT);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
