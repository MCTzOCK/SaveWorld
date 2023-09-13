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
import { useIonRouter } from "@ionic/react";

export default function AppUrlListener() {
  let router = useIonRouter();
  useEffect(() => {
    App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      const slug = event.url.split(".one").pop();
      if (slug) {
        router.push(slug, "forward", "push");
      }
    });
    return () => {
      App.removeAllListeners();
    };
  }, []);
  return null;
}
