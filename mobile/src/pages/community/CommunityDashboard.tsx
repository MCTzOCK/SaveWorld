/**
 * mobile/src/pages/community/CommunityDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import {
  add,
  addSharp,
  apps,
  appsSharp,
  people,
  peopleSharp,
  person,
  personSharp,
} from "ionicons/icons";
import CommunityFollowingDashboard from "../../components/CommunityFollowingDashboard";
import CommunitySuggestedDashboard from "../../components/CommunitySuggestedDashboard";
import CommunitySearchDashboard from "../../components/CommunitySearchDashboard";

export default function CommunityDashboard() {
  useRedirectForAnon();

  const [segment, setSegment] = React.useState<
    "explore" | "following" | "search"
  >("explore");

  return (
    <>
      <Page title={"Community"}>
        <IonSegment
          value={segment}
          onIonChange={(ev) => {
            setSegment(ev.detail.value as typeof segment);
          }}
        >
          <IonSegmentButton value={"explore"}>Entdecken</IonSegmentButton>
          <IonSegmentButton value={"following"}>Folge Ich</IonSegmentButton>
          <IonSegmentButton value={"search"}>Suchen</IonSegmentButton>
        </IonSegment>
        {segment === "explore" && (
          <>
            <CommunitySuggestedDashboard />
          </>
        )}
        {segment === "following" && (
          <>
            <CommunityFollowingDashboard />
          </>
        )}
        {segment === "search" && (
          <>
            <CommunitySearchDashboard />
          </>
        )}
      </Page>
    </>
  );
}
