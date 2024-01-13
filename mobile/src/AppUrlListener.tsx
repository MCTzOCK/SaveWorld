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
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useIonRouter } from "@ionic/react";

export default function AppUrlListener() {
  let router = useIonRouter();
  useEffect(() => {
    App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      let slug = "";      

      if(event.url.startsWith("saveworld://")) {
        slug = event.url.split("://").pop() as string;
      } else {
        slug = event.url.split(".one").pop() as string;
      }
      if (slug) {
        router.push(slug, "forward", "push");
      }
    });

    App.getLaunchUrl().then((v) => {
      if (v) {
      }
    });

    return () => {
      App.removeAllListeners();
    };
  }, []);
  return null;
}
