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
  Badge,
  Box,
  Button,
  ButtonGroup,
  ChakraProvider,
  Flex,
  Heading,
  IconButton,
  Link,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { theme } from "../theme/chakra";
import DrawerMenu from "./DrawerMenu";
import FloatingNavbar from "./FloatingNavbar";
import { useFlags } from "flagsmith/react";
import { FaBars } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { $$ } from "../translations/i18n";

export default function Page(props: {
  title: string;
  children: React.ReactNode;
  redGradient?: boolean;
  setPresentingElement?: React.Dispatch<
    React.SetStateAction<HTMLElement | undefined>
  >;
  noPadding?: boolean;
  endButtons?: React.ReactNode;
  background?: string;
  noHeader?: boolean;
  isBeta?: boolean;
}) {
  const flags = useFlags(["floating_navbar"]);

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
          <Flex
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            backgroundColor={"#121212"}
            borderBottom={"3px solid rgba(40,40,40,1)"}
            pl={4}
            pr={4}
            pt={["2.5rem", 0]}
          >
            <DrawerMenu isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
            <Heading
              fontWeight={1000}
              color={props.redGradient ? "red.500" : "brand.500"}
              size={"lg"}
            >
              {props.title}
              {props.isBeta && (
                <Badge ml={2} colorScheme={"red"}>
                  {$$("general.beta")}
                </Badge>
              )}
            </Heading>
            <ButtonGroup>
              {props.endButtons}
              <IconButton
                size={"lg"}
                onClick={() => {
                  router.push("/");
                }}
                icon={<FaHome />}
                aria-label={$$("menu.home")}
                variant={"ghost"}
                color={props.redGradient ? "red.500" : "brand.500"}
              />
              <IconButton
                size={"lg"}
                onClick={onOpen}
                icon={<FaBars />}
                aria-label={$$("menu.menu")}
                variant={"ghost"}
                color={props.redGradient ? "red.500" : "brand.500"}
              />
            </ButtonGroup>
          </Flex>
        </IonHeader>
        <IonContent
          fullscreen
          style={{
            overflow: "hidden",
            "--background": props.background,
          }}
          className={props.noPadding ? "" : "ion-padding"}
        >
          {loaded ? (
            <>
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
              {flags.floating_navbar.enabled && <FloatingNavbar />}
            </>
          ) : (
            <>
              <Flex
                w={"100%"}
                h={"100vh"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Spinner size={"xl"} color={"brand.500"} />
              </Flex>
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
}
