/**
 * mobile/src/pages/FinishWelcome.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.08.2023
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

export default function FinishWelcome() {
  return (
    <>
      <Page title={"Fertig!"}>
        <IonCard
          style={{
            boxShadow: "70px 50px 70px 50px rgba(0,100,0,0.75)",
          }}
        >
          <IonCardHeader>
            <IonCardTitle>Einrichtung abgeschlossen!</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              Du hast die Einrichtung erfolgreich abgeschlossen! Du kannst jetzt
              anfagen die Welt zu einem besseren Ort zu machen!
            </IonText>
            <IonButton
              expand={"block"}
              style={{
                marginTop: "2rem",
              }}
              routerLink={"/"}
              routerDirection={"none"}
            >
              Die Welt verbessern!
            </IonButton>
          </IonCardContent>
        </IonCard>
      </Page>
    </>
  );
}
