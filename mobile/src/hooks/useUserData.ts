/**
 * /useUserData.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import OneSignal from "onesignal-cordova-plugin";
import { isPlatform } from "@ionic/react";

export function useUserData(): {
  loggedIn: boolean;
  loaded: boolean;
  userInfo: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    totpActive: boolean;
    role: string;
    username: string;
  };
} {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState({
    _id: "",
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    totpActive: false,
    role: "user",
  });

  useEffect(() => {
    let token: string | null = null;
    const interval = setInterval(() => {
      const newToken = localStorage.getItem("token");
      if (newToken !== null) {
        if (newToken !== token) {
          REST.Account.verify(newToken).then(async (res) => {
            if (res.status === 200) {
              if (res.payload.token) {
                localStorage.setItem("token", res.payload.token);
                token = res.payload.token;

                const r = await REST.Account.verify(token as string);

                if (r.status === 200 || r.status === 304) {
                  setLoggedIn(true);
                  setUserInfo(r.payload.user);
                } else {
                  setLoggedIn(false);
                }
                setLoaded(true);
                return;
              }

              token = newToken;
              setLoggedIn(true);
              setUserInfo({
                _id: res.payload.user.id,
                ...res.payload.user,
              });
            } else {
              token = null;

              if (!isPlatform("desktop")) {
                OneSignal.logout();
              }
              setLoggedIn(false);
              localStorage.removeItem("token");
            }
            setLoaded(true);
          });
        }
      } else {
        token = null;

        if (isPlatform("hybrid")) {
          OneSignal.logout();
        }
        setLoggedIn(false);
        setLoaded(true);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return {
    loggedIn,
    loaded,
    userInfo,
  };
}
