/**
 * /Page.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";

export default function Page(props: {
  title: string;
  children: React.ReactNode;
  redGradient?: boolean;
}) {
  return (
    <>
      <IonPage
        style={{
          overflow: "hidden",
        }}
      >
        <IonHeader>
          <IonToolbar style={{
            "--background": !props.redGradient
              ? "linear-gradient(45deg, #8BFE6B 30%, #538EFF 90%)"
              : "linear-gradient(45deg, #ca2238 30%, #eb445a 90%)",
            "--min-height": "50px",
        }}>
            <IonButtons slot="start">
              <IonBackButton text={"Zurück"} style={{
                "--color": props.redGradient ? "white" : "black",
              }} />
            </IonButtons>
            <IonTitle>{props.title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent
          fullscreen
          style={{
            overflow: "hidden",
          }}
        >

          <div
            style={{
              padding: "20px"
            }}
          >
            {props.children}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
