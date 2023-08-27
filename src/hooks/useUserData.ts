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

export function useUserData(): {
  loggedIn: boolean;
  loaded: boolean;
  userInfo: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    totpActive: boolean;
    role: string;
    admin: boolean;
    username: string;
  };
} {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: "",
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    totpActive: false,
    role: "user",
    admin: false,
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

                if (r.status === 200) {
                  setLoggedIn(true);
                  setUserInfo({
                    ...r.payload.user,
                    admin: r.payload.user.role === "admin",
                  });
                } else {
                  setLoggedIn(false);
                }
                setLoaded(true);
                return;
              }

              token = newToken;
              setLoggedIn(true);
              setUserInfo({
                ...res.payload.user,
                admin: res.payload.user.role === "admin",
              });
            } else {
              token = null;
              setLoggedIn(false);
              localStorage.removeItem("token");
            }
            setLoaded(true);
          });
        }
      } else {
        token = null;
        setLoggedIn(false);
        setLoaded(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return {
    loggedIn,
    loaded,
    userInfo,
  };
}
