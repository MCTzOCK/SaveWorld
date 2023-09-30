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
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonTabBar,
  IonTabButton,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useUserData } from "../hooks/useUserData";
import {
  add,
  addSharp,
  alertCircle,
  book,
  bookSharp,
  chatbox,
  chatboxSharp,
  cog,
  home,
  homeSharp,
  leaf,
  leafSharp,
  mail,
  menu,
  menuSharp,
  people,
  peopleSharp,
  person,
  personSharp,
  search,
  searchSharp,
} from "ionicons/icons";
import { ENDPOINT } from "../env";
import {
  Avatar,
  Button,
  ChakraProvider,
  useDisclosure,
} from "@chakra-ui/react";
import { theme } from "../theme/chakra";
import DrawerMenu from "./DrawerMenu";

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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IonPage
        style={{
          overflow: "hidden",
          "--background": "#000",
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
                  <DrawerMenu
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                  />
                  <IonButton
                    size={"large"}
                    onClick={onOpen}
                    style={{
                      "--color": "var(--ion-color-light-shade)",
                    }}
                  >
                    <IonIcon ios={menu} md={menuSharp} />
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
                <IonFabButton routerLink={"/community"} color={"success"}>
                  <IonIcon ios={home} md={homeSharp} />
                </IonFabButton>
              </IonFabList>
            </IonFab>
          ) : null}
        </IonContent>

        <IonFooter>
          <IonTabBar>
            <IonTabButton
              tab="onboarding"
              href="/onboarding"
              disabled={!loggedIn}
              selected={false}
            >
              <IonIcon aria-hidden="true" ios={home} md={homeSharp} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="e2"
              href="/e2"
              disabled={!loggedIn}
              selected={false}
            >
              <IonIcon aria-hidden="true" ios={leaf} md={leafSharp} />
              <IonLabel>Tracker</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="learn"
              href="/learn"
              disabled={!loggedIn}
              selected={false}
            >
              <IonIcon aria-hidden="true" ios={book} md={bookSharp} />
              <IonLabel>Lernen</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonFooter>
      </IonPage>
    </>
  );
}
