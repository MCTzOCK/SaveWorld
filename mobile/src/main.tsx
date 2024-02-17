import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { REST, setApiUrl } from "@saveworld/api-js";
import { DEV_ENDPOINT, ENDPOINT } from "./env";
import { Network } from "@capacitor/network";
import Root from "./Root";
import PopupManager from "./util/PopupManager";
import NoConnection from "./components/NoConnection";
import { Preferences } from "@capacitor/preferences";
import { I18n } from "./translations/i18n";

window.PopupManager = PopupManager;
window.REST = REST;

const render = async () => {
  Preferences.get({ key: "language" }).then((res) => {
    let lang = "";
    if (res.value === null) {
      Preferences.set({ key: "language", value: "de" });
      lang = "de";
    } else {
      lang = res.value;
    }

    window.language = lang;
  });

  const status = await Network.getStatus();
  const container = document.getElementById("root");
  const root = createRoot(container!);

  if (status.connected) {
    if (localStorage.getItem("useDevServer") !== null) {
      setApiUrl(DEV_ENDPOINT);
    } else {
      setApiUrl(ENDPOINT);
    }
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
