/**
 * mobile/src/pages/NotFound.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.08.2023
 *
 */

import * as React from "react";
import Page from "../components/Page";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";

export default function NotFound() {
  return (
    <Page title={"404"}>
      <IonCard>
        <img
          alt={"Nicht gefunden - 404"}
          src={"/assets/vectors/404.svg"}
          width={"100%"}
        />
        <IonCardHeader>
          <IonCardTitle>Nicht gefunden</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>
            Die Seite konnte nicht gefunden werden. Wenn du glaubst, dass dies
            ein Fehler ist, wende dich bitte an den Support
          </IonText>
          <IonButton
            color={"success"}
            expand={"block"}
            href={"mailto:hello@ben-siebert.de"}
          >
            Support kontaktieren
          </IonButton>
        </IonCardContent>
      </IonCard>
    </Page>
  );
}
