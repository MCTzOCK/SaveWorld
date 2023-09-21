/**
 * mobile/src/pages/e2/E2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.09.2023
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { REST } from "@saveworld/api-js";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
  IonText,
} from "@ionic/react";
import E2SubmitModal from "../../components/E2SubmitModal";
import E2Data from "../../components/E2Data";

export default function E2() {
  useRedirectForAnon();

  const [segment, setSegment] = useState<"data" | "analytics">("data");

  return (
    <>
      <Page title={"Tracker"}>
        <IonSegment
          value={segment}
          onIonChange={(ev) => {
            setSegment(ev.detail.value as any);
          }}
        >
          <IonSegmentButton value={"data"}>
            <IonLabel>Übersicht</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value={"analytics"}>
            <IonLabel>Analyse</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {segment === "data" ? (
          <>
            <E2Data />
          </>
        ) : null}
      </Page>
    </>
  );
}
