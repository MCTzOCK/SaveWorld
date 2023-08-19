/**
 * /useRedirectForAnon.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */
import { useIonRouter } from "@ionic/react";
import { useUserData } from "./useUserData";
import { useEffect } from "react";

export function useRedirectForAnon(options?: { onlyAdmins?: boolean }) {
  const router = useIonRouter();
  const { loggedIn, loaded, userInfo } = useUserData();

  useEffect(() => {
    if (loaded && router) {
      if (!loggedIn) {
        router.push("/register", "none", "replace");
      } else {
        if (options && options.onlyAdmins) {
          if (userInfo) {
            if (!userInfo.admin) {
              router.push("/", "none", "replace");
            }
          }
        }
      }
    }
  }, [loaded, loggedIn, router]);
}
