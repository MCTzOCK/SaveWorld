/**
 * mobile/src/components/DrawerMenu.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import * as React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useUserData } from "../hooks/useUserData";
import { IonList, IonSearchbar, isPlatform, useIonRouter } from "@ionic/react";
import { useEffect } from "react";
import {
  FaCalculator,
  FaCalendar,
  FaCogs,
  FaEnvelope,
  FaFile,
  FaHome,
  FaInfoCircle,
  FaMarkdown,
  FaPen,
  FaProjectDiagram,
  FaSearch,
} from "react-icons/fa";
import {
  FaEarthEurope,
  FaHammer,
  FaLeaf,
  FaNewspaper,
  FaPeopleGroup,
  FaPerson,
  FaPlus,
  FaRightFromBracket,
  FaUsers,
  FaVideo,
} from "react-icons/fa6";
import PopupManager from "../util/PopupManager";
import OneSignal from "onesignal-cordova-plugin";

export default function DrawerMenu(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const { userInfo, loggedIn } = useUserData();

  const [query, setQuery] = React.useState<string>("");

  const router = useIonRouter();

  const [groups, setGroups] = React.useState<
    {
      label: string;
      color?: string;
      items: {
        label: string;
        icon: React.ReactNode | JSX.Element;
        onClick: () => void;
      }[];
    }[]
  >([]);

  useEffect(() => {
    let gr: typeof groups = [
      {
        label: "SaveWorld",
        items: [
          {
            label: "Home",
            icon: <FaHome />,
            onClick: () => {
              router.push("/onboarding", "none", "replace");
            },
          },
          {
            label: "Neuigkeiten",
            icon: <FaNewspaper />,
            onClick: () => {
              router.push("/news", "none", "replace");
            },
          },
        ],
      },
      {
        label: "Konto",
        items: [
          {
            label: "Einstellungen",
            icon: <FaCogs />,
            onClick: () => {
              router.push("/account", "none", "replace");
            },
          },
          {
            label: "Benachrichtigungen",
            icon: <FaEnvelope />,
            onClick: () => {
              router.push("/notifications", "none", "replace");
            },
          },
          {
            label: "Hilfe",
            icon: <FaInfoCircle />,
            onClick: () => {
              router.push("/support", "none", "replace");
            },
          },
          {
            label: "Abmelden",
            icon: <FaRightFromBracket />,
            onClick: async () => {
              if (
                !(await PopupManager.confirmAsync({
                  title: "Abmelden",
                  question: "Möchtest du dich wirklich abmelden?",
                }))
              )
                return;

              if (!isPlatform("desktop")) {
                OneSignal.logout();
              }
              localStorage.removeItem("token");
              router.push("/login", "none", "replace");
            },
          },
        ],
      },
      {
        label: "Lernen",
        items: [
          {
            label: "Videos",
            icon: <FaVideo />,
            onClick: () => {
              router.push("/learn", "none", "replace");
            },
          },
          {
            label: "Suchen",
            icon: <FaSearch />,
            onClick: () => {
              router.push("/learn/fts-search", "none", "replace");
            },
          },
        ],
      },
      {
        label: "Tracker",
        items: [
          {
            label: "Übersicht",
            icon: <FaLeaf />,
            onClick: () => {
              router.push("/e2", "none", "replace");
            },
          },
        ],
      },
      {
        label: "Nachhaltigkeit",
        items: [
          {
            label: "Was ist Nachhaltigkeit?",
            icon: <FaEarthEurope />,
            onClick: () => {
              router.push("/sustainability", "none", "replace");
            },
          },
        ],
      },
      {
        label: "Werkzeuge",
        items: [
          {
            label: "CO2-Rechner",
            icon: <FaCalculator />,
            onClick: () => {
              router.push("/tools/co2", "none", "replace");
            },
          },
        ],
      },
      {
        label: "Öko-Projekte",
        items: [
          {
            label: "Meine Projekte",
            icon: <FaProjectDiagram />,
            onClick: () => {
              router.push("/e2-projects/my", "none", "replace");
            },
          },
          {
            label: "Projekt starten",
            icon: <FaPlus />,
            onClick: () => {
              router.push("/e2-projects/new", "none", "replace");
            },
          },
          {
            label: "Projekte finden",
            icon: <FaSearch />,
            onClick: () => {
              router.push("/e2-projects/search", "none", "replace");
            },
          },
        ],
      },
      {
        label: "Community",
        items: [
          {
            label: "Home",
            icon: <FaPeopleGroup />,
            onClick: () => {
              router.push("/community", "none", "replace");
            },
          },
          {
            label: "Neuer Blog",
            icon: <FaPen />,
            onClick: () => {
              router.push("/community/create/blog", "none", "replace");
            },
          },
          {
            label: "Nachrichten",
            icon: <FaEnvelope />,
            onClick: () => {
              router.push("/community/messages", "none", "replace");
            },
          },
          {
            label: "Mein Profil",
            icon: <FaPerson />,
            onClick: () => {
              router.push(
                "/community/u/" + userInfo.username,
                "none",
                "replace",
              );
            },
          },
        ],
      },
      {
        label: "Ressourcen",
        items: [
          {
            label: "Markdown-Hilfe",
            icon: <FaMarkdown />,
            onClick: () => {
              router.push("/resources/md-help", "none", "replace");
            },
          },
        ],
      },
    ];

    if (userInfo.role === "admin") {
      gr.push({
        label: "Admin",
        color: "var(--ion-color-danger)",
        items: [
          {
            label: "Übersicht",
            icon: <FaHammer />,
            onClick: () => {
              router.push("/admin", "none", "replace");
            },
          },
          {
            label: "Benutzer",
            icon: <FaUsers />,
            onClick: () => {
              router.push("/admin/users", "none", "replace");
            },
          },
          {
            label: "Support-Anfragen",
            icon: <FaInfoCircle />,
            onClick: () => {
              router.push("/admin/support-requests", "none", "replace");
            },
          },
          {
            label: "Videos",
            icon: <FaVideo />,
            onClick: () => {
              router.push("/admin/videos", "none", "replace");
            },
          },
          {
            label: "Lifestyle-Vorlagen",
            icon: <FaFile />,
            onClick: () => {
              router.push("/admin/lifestyle-templates", "none", "replace");
            },
          },
          {
            label: "Interessen",
            icon: <FaLeaf />,
            onClick: () => {
              router.push("/admin/content/categories", "none", "replace");
            },
          },
        ],
      });
    }

    setGroups(gr);
    setCurrentGroups(gr);
  }, [userInfo, loggedIn]);

  const [currentGroups, setCurrentGroups] =
    React.useState<typeof groups>(groups);

  useEffect(() => {
    let grs: typeof groups = [];

    for (const g of groups) {
      const items = g.items.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase());
      });

      if (items.length > 0) {
        grs.push({
          label: g.label,
          color: g.color,
          items: items,
        });
      }
    }

    setCurrentGroups(grs);
  }, [query]);

  return (
    <>
      <Drawer isOpen={props.isOpen} onClose={props.onClose} size={"sm"}>
        <DrawerOverlay />
        <DrawerContent bgColor={"black"} pt={"2rem"}>
          <DrawerCloseButton mt={"2rem"} />
          <DrawerHeader color={"var(--ion-color-success)"} fontWeight={1000}>
            SaveWorld
          </DrawerHeader>
          <DrawerBody
            style={{
              overflow: "hidden",
            }}
          >
            <IonSearchbar
              style={{
                padding: 0,
              }}
              value={query}
              onIonInput={(e) => {
                setQuery(e.detail.value as string);
              }}
              placeholder={"Suchen"}
            />
            <div
              style={{
                gap: "1rem",
                display: "flex",
                flexDirection: "column",
                maxHeight: "80vh",
                height: "fit-content",
                overflow: "auto",
              }}
            >
              {currentGroups.map((group) => {
                return (
                  <>
                    <Text
                      fontWeight={1000}
                      color={group.color ? group.color : "brand.500"}
                    >
                      {group.label}
                    </Text>
                    {group.items.map((item) => {
                      return (
                        <Text
                          onClick={() => {
                            item.onClick();
                            props.onClose();
                          }}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                            alignItems: "center",
                          }}
                        >
                          <Text color={group.color ? group.color : "brand.500"}>
                            &#8735;
                          </Text>
                          {item.icon}
                          {item.label}
                        </Text>
                      );
                    })}
                  </>
                );
              })}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
