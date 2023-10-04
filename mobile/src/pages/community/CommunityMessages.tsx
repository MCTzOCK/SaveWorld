/**
 * mobile/src/pages/community/CommunityMessages.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.23
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useEffect } from "react";
import Page from "../../components/Page";
import { useUserData } from "../../hooks/useUserData";
import { Socket } from "socket.io-client";

export default function CommunityMessages(props: { socket: Socket }) {
  useRedirectForAnon();

  const { loggedIn, loaded, userInfo } = useUserData();

  useEffect(() => {
    if (loaded && loggedIn) {
      props.socket.on("sw:auth.authenticate", (data) => {
        props.socket.emit("sw:connection.info");
      });

      props.socket.on("sw:connection.info", (data) => {
        alert(JSON.stringify(data));
      });

      props.socket.emit(
        "sw:auth.authenticate",
        localStorage.getItem("token") as string,
      );
    }
  }, [loggedIn, loaded]);
  return (
    <>
      <Page title={"Nachrichten"}>Nachrichten</Page>
    </>
  );
}
