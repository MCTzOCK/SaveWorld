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
  people,
  peopleSharp,
  person,
  personSharp,
  videocam,
  videocamSharp,
} from "ionicons/icons";
import { useUserData } from "../hooks/useUserData";
import { useEffect } from "react";

export default function Onboarding() {
  const router = useIonRouter();
  const { loggedIn, loaded } = useUserData();

  useEffect(() => {
    if (loaded && router) {
      if (!loggedIn) {
        router.push("/register", "none", "replace");
      }
    }
  }, [loaded, loggedIn, router]);

  return (
    <>
      <IonPage>
        <IonContent fullscreen>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                background: "linear-gradient(45deg, #8BFE6B 30%, #538EFF 90%)",
                width: "100%",
                height: "25%",
                rotate: "180deg",
              }}
            ></div>
          </div>
          <IonText
            style={{
              fontSize: "50px",
              fontWeight: "bold",
              position: "relative",
              top: "15%",
              left: "5%",
            }}
            color={"white"}
          >
            SaveWorld
          </IonText>
          <div
            style={{
              position: "relative",
              top: "20%",
              height: "fit-content",
            }}
          >
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
                <IonList inset>
                  <IonItem detail routerLink={"/account"}>
                    <IonIcon ios={person} md={personSharp} slot={"start"} />
                    Konto-Verwaltung
                  </IonItem>
                  <IonItem detail routerLink={"/videos"}>
                    <IonIcon ios={videocam} md={videocamSharp} slot={"start"} />
                    Lern-Videos
                  </IonItem>
                  <IonItem detail routerLink={"/community"}>
                    <IonIcon ios={people} md={peopleSharp} slot={"start"} />
                    Community
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
