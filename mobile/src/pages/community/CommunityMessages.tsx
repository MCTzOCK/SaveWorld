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
import { IonSegment, IonSegmentButton } from "@ionic/react";
import CommunityMessagesChats from "../../components/CommunityMessagesChats";

export default function CommunityMessages(props: { socket: Socket }) {
  useRedirectForAnon();

  const [segment, setSegment] = React.useState<"chats" | "groups">("chats");

  return (
    <>
      <Page title={"Nachrichten"}>
        <IonSegment
          value={segment}
          onIonChange={(e) => setSegment(e.detail.value as any)}
        >
          <IonSegmentButton value="chats">Chats</IonSegmentButton>
          <IonSegmentButton value="groups">Gruppen</IonSegmentButton>
        </IonSegment>
        {segment === "chats" && (
          <>
            <CommunityMessagesChats socket={props.socket} />
          </>
        )}
        {segment === "groups" && (
          <>
            <p>Diese Funktion befindet sich aktuell in der Entwicklung.</p>
          </>
        )}
      </Page>
    </>
  );
}
