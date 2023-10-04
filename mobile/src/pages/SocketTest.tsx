/**
 * mobile/src/pages/SocketTest.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.23
 *
 */

import * as React from "react";
import Page from "../components/Page";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { ENDPOINT } from "../env";
import { useUserData } from "../hooks/useUserData";

export default function SocketTest() {
  const { userInfo, loaded, loggedIn } = useUserData();

  useEffect(() => {
    if (loaded && loggedIn) {
      const socket = io(ENDPOINT);
      socket.on("sw:auth.authenticate", (data) => {
        alert("Authenticate " + JSON.stringify(data));
        socket.emit("sw:connection.info");
      });
      socket.on("sw:connection.info", (data) => {
        alert("Conn Info " + JSON.stringify(data));
      });

      socket.emit(
        "sw:auth.authenticate",
        localStorage.getItem("token") as string,
      );
    }
  }, [loaded, loggedIn]);

  return (
    <>
      <Page title={"S2 Test"}>Socket Test</Page>
    </>
  );
}
