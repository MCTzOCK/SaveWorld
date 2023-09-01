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
import { useEffect } from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

export default function Page(props: {
  title: string;
  children: React.ReactNode;
  redGradient?: boolean;
  setPresentingElement?: React.Dispatch<
    React.SetStateAction<HTMLElement | undefined>
  >;
}) {
  const ref = React.useRef<HTMLElement>(null);

  useEffect(() => {
    if (props.setPresentingElement && ref.current) {
      props.setPresentingElement(ref.current);
    }
  }, []);

  return (
    <>
      <IonPage
        style={{
          overflow: "hidden",
        }}
        ref={ref}
      >
        <IonHeader>
          <IonToolbar
            style={{
              /*
                            "--background": !props.redGradient
                              ? "linear-gradient(45deg, #538EFF 30%, #8BFE6B 90%)"
                              : "linear-gradient(45deg, #ca2238 30%, #eb445a 90%)",
                               */
              "--background": props.redGradient
                ? "var(--ion-color-danger-shade)"
                : "var(--ion-color-success-shade)",
              "--min-height": "75px",
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
            }}
          >
            <IonButtons slot="start">
              <IonBackButton
                text={"Zurück"}
                style={{
                  "--color": props.redGradient ? "white" : "black",
                }}
              />
            </IonButtons>
            <IonTitle size={"large"}>{props.title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent
          fullscreen
          style={{
            overflow: "hidden",
          }}
          className={"ion-padding"}
        >
          {props.children}
        </IonContent>
      </IonPage>
    </>
  );
}
