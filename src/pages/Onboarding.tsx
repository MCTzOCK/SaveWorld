/**
 * /Onboarding.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonText,
  useIonRouter,
} from "@ionic/react";
import {
  book,
  bookSharp,
  leaf,
  leafSharp,
  people,
  peopleSharp,
  person,
  personSharp,
  videocam,
  videocamSharp,
  warning,
  warningSharp,
} from "ionicons/icons";
import { useUserData } from "../hooks/useUserData";
import { useEffect } from "react";
import Page from "../components/Page";
import { useRedirectForAnon } from "../hooks/useRedirectForAnon";

export default function Onboarding() {
  const { userInfo } = useUserData();
  useRedirectForAnon();

  return (
    <>
      <Page title={"SaveWorld"}>
        <div
          style={{
            position: "fixed",
            width: "300%",
            height: "25%",
            background: "var(--ion-color-success-shade)",
            top: "25%",
            left: "-50%",
            rotate: "-35deg",
          }}
        ></div>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>SaveWorld</IonCardTitle>
            <IonCardSubtitle>Verbesser die Welt</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              Willkommen bei SaveWorld! Hier kannst du die Welt verbessern!
              Aktuell bietet die App dir folgende Funktionen:
            </IonText>
            <IonList
              inset
              style={{
                width: "100%",
                margin: 0,
                marginTop: "1.2rem",
              }}
            >
              <IonItem detail routerLink={"/account"}>
                <IonIcon ios={person} md={personSharp} slot={"start"} />
                Konto-Verwaltung
              </IonItem>
              <IonItem detail routerLink={"/learn"}>
                <IonIcon ios={book} md={bookSharp} slot={"start"} />
                Lernen
              </IonItem>
              <IonItem detail routerLink={"/e2"}>
                <IonIcon ios={leaf} md={leafSharp} slot={"start"} />
                Tracker
              </IonItem>
              <IonItem detail routerLink={"/community"}>
                <IonIcon ios={people} md={peopleSharp} slot={"start"} />
                Community
              </IonItem>
              {userInfo.role === "admin" && (
                <IonItem detail routerLink={"/admin"}>
                  <IonIcon
                    color={"danger"}
                    slot={"start"}
                    ios={warning}
                    md={warningSharp}
                  />
                  <IonText color={"danger"}>Admin-Panel</IonText>
                </IonItem>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>
      </Page>
    </>
  );
}
