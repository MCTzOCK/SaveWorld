/**
 * mobile/src/pages/Welcome.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.08.2023
 *
 */

import * as React from "react";
import Page from "../components/Page";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import WelcomeInterestModal from "../components/WelcomeInterestModal";
import { useRedirectForAnon } from "../hooks/useRedirectForAnon";

export default function Welcome() {
  useRedirectForAnon();

  const modal = useRef<HTMLIonModalElement>(
    null,
  ) as React.MutableRefObject<HTMLIonModalElement>;
  const page = useRef(null);
  const [presentingElement, setPresentingElement] = useState<HTMLElement>();

  useEffect(() => {
    if (page.current) {
      setPresentingElement(page.current);
    }
  }, []);

  return (
    <>
      <Page title={"Willkommen!"} setPresentingElement={setPresentingElement}>
        <IonCard
          style={{
            boxShadow: "65px 50px 65px 50px rgba(0,100,0,0.75)",
          }}
        >
          <IonCardHeader>
            <IonCardTitle>Einrichtung</IonCardTitle>
            <IonCardSubtitle>an Interessen anpassen</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              Hey, willkommen bei <b>SaveWorld</b>! Wir freuen uns, dass du die
              Welt verbessern willst! Für eine optimale Erfahrung, solltest du
              hier deine Interessen auswählen! Du kannst diese später jederzeit
              ändern.
            </IonText>
            <IonButton
              expand={"block"}
              color={"success"}
              style={{
                marginTop: "2rem",
              }}
              onClick={() => {
                modal.current?.present();
              }}
            >
              Weiter
            </IonButton>
            <IonButton
              expand={"block"}
              color={"danger"}
              fill={"outline"}
              style={{
                marginTop: "1.2rem",
              }}
              routerLink={"/"}
              routerDirection={"none"}
            >
              Später auswählen
            </IonButton>
          </IonCardContent>
        </IonCard>
        <WelcomeInterestModal
          modal={modal}
          presentingElement={presentingElement}
        />
      </Page>
    </>
  );
}
