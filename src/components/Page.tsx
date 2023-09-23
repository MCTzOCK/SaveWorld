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
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useUserData } from "../hooks/useUserData";
import {
  add,
  addSharp,
  chatbox,
  chatboxSharp,
  people,
  peopleSharp,
  person,
  personSharp,
  search,
  searchSharp,
} from "ionicons/icons";
import { ENDPOINT } from "../env";

export default function Page(props: {
  title: string;
  children: React.ReactNode;
  redGradient?: boolean;
  setPresentingElement?: React.Dispatch<
    React.SetStateAction<HTMLElement | undefined>
  >;
  noPadding?: boolean;
  endButtons?: React.ReactNode;
}) {
  const ref = React.useRef<HTMLElement>(null);

  const { loggedIn, loaded, userInfo } = useUserData();

  const router = useIonRouter();

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
            <IonButtons slot={"end"}>
              {props.endButtons}
              {loggedIn && userInfo._id ? (
                <>
                  <IonButton routerLink={"/account"}>
                    <IonAvatar>
                      <img
                        src={
                          ENDPOINT + "/media/profile-picture/" + userInfo._id
                        }
                      />
                    </IonAvatar>
                  </IonButton>
                </>
              ) : null}
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent
          fullscreen
          style={{
            overflow: "hidden",
          }}
          className={props.noPadding ? "" : "ion-padding"}
        >
          {props.children}
          {router &&
          router.routeInfo &&
          router.routeInfo.pathname &&
          router.routeInfo.pathname.startsWith("/community") ? (
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton color={"success"}>
                <IonIcon ios={people} md={peopleSharp} />
              </IonFabButton>
              <IonFabList side={"top"}>
                <IonFabButton
                  routerLink={"/community/u/" + userInfo.username}
                  color={"success"}
                >
                  <IonIcon ios={person} md={personSharp} />
                </IonFabButton>
                <IonFabButton
                  routerLink={"/community/messages"}
                  color={"success"}
                >
                  <IonIcon ios={chatbox} md={chatboxSharp} />
                </IonFabButton>
                <IonFabButton
                  routerLink={"/community/create/blog"}
                  color={"success"}
                >
                  <IonIcon ios={add} md={addSharp} />
                </IonFabButton>
              </IonFabList>
            </IonFab>
          ) : null}
        </IonContent>
      </IonPage>
    </>
  );
}
