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
import E2Analytics from "../../components/E2Analytics";
import ProgressBar from "@ramonak/react-progress-bar";
import PopupManager from "../../util/PopupManager";

export default function E2() {
  useRedirectForAnon();

  const [segment, setSegment] = useState<"data" | "analytics">("data");

  const [level, setLevel] = useState<number>(0);

  useEffect(() => {
    REST.Lifestyle.level(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setLevel(res.payload.level);
        } else {
          PopupManager.alert({
            title: "Fehler",
            description:
              "Level konnte nicht geladen werden: " + res.payload.error,
          });
        }
      },
    );
  }, []);

  return (
    <>
      <Page title={"Tracker"}>
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <IonText>Aktueller Level</IonText>
          <ProgressBar
            completed={level}
            maxCompleted={10}
            customLabel={level + ""}
            bgColor={
              level < 3
                ? "var(--ion-color-danger)"
                : level < 6
                ? "var(--ion-color-warning)"
                : level < 9
                ? "var(--ion-color-success)"
                : "var(--ion-color-primary)"
            }
          />
        </div>
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
        {segment === "data" ? <E2Data /> : <E2Analytics />}
      </Page>
    </>
  );
}
