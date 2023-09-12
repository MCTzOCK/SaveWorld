/**
 * mobile/src/AppUrlListener.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.09.2023
 *
 */
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { App, URLOpenListenerEvent } from "@capacitor/app";

export default function AppUrlListener() {
  let history = useHistory();
  useEffect(() => {
    App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      // https://app.saveworld.one/root-page/sub-page
      // -> /root-page/sub-page
      const slug = event.url.split(".one")[1];
      if (slug) {
        history.push(slug);
      }
    });
  }, []);
  return null;
}
