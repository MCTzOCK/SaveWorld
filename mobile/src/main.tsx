import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setApiUrl } from "@saveworld/api-js";
import { ENDPOINT } from "./env";
import { Network } from "@capacitor/network";
import Root from "./Root";
import PopupManager from "./util/PopupManager";
import NoConnection from "./components/NoConnection";

window.PopupManager = PopupManager;

const render = async () => {
  const status = await Network.getStatus();
  const container = document.getElementById("root");
  const root = createRoot(container!);

  if (status.connected) {
    setApiUrl(ENDPOINT);
    root.render(
      <Root>
        <App />
      </Root>,
    );
  } else {
    root.render(<NoConnection />);
  }
};

render();

Network.addListener("networkStatusChange", render);
