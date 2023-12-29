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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
  FaBook,
  FaEarthEurope,
  FaHammer,
  FaLeaf,
  FaNewspaper,
  FaPeopleGroup,
  FaPerson,
  FaPlus,
  FaRightFromBracket,
  FaUsers,
  FaUtensils,
  FaVideo,
} from "react-icons/fa6";
import PopupManager from "../util/PopupManager";
import OneSignal from "onesignal-cordova-plugin";
import {
  BiCalculator,
  BiCog,
  BiEnvelope,
  BiFile,
  BiGroup,
  BiHome,
  BiInfoCircle,
  BiLeaf,
  BiLogoMarkdown,
  BiLogOut,
  BiNews,
  BiPen,
  BiPlanet,
  BiPlus,
  BiQuestionMark,
  BiSearch,
  BiUser,
  BiVideo,
} from "react-icons/bi";
import SaveWorldModal from "./SaveWorldModal";
import { useFlags } from "flagsmith/react";

export default function DrawerMenu(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const flags = useFlags([
    "videos",
    "quizzes",
    "tracker",
    "news",
    "sustainability_articles",
    "tools_co2_calc",
    "eco_projects",
    "community",
    "video_category_channels",
    "recipes",
    "eatingplans",
  ]);

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
            icon: <BiHome />,
            onClick: () => {
              router.push("/onboarding", "none", "replace");
            },
          },
        ],
      },
      {
        label: "Konto",
        items: [
          {
            label: "Einstellungen",
            icon: <BiCog />,
            onClick: () => {
              router.push("/account", "none", "replace");
            },
          },
          {
            label: "Benachrichtigungen",
            icon: <BiEnvelope />,
            onClick: () => {
              router.push("/notifications", "none", "replace");
            },
          },
          {
            label: "Hilfe",
            icon: <BiInfoCircle />,
            onClick: () => {
              router.push("/support", "none", "replace");
            },
          },
          {
            label: "Abmelden",
            icon: <BiLogOut />,
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
        items: [],
      },
    ];

    if (flags.news.enabled) {
      gr[0].items.push({
        label: "Neuigkeiten",
        icon: <BiNews />,
        onClick: () => {
          router.push("/news", "none", "replace");
        },
      });
    }

    if (flags.videos.enabled) {
      gr[2].items.push({
        label: "Videos",
        icon: <BiVideo />,
        onClick: () => {
          router.push("/learn", "none", "replace");
        },
      });
      gr[2].items.push({
        label: "Suchen",
        icon: <BiSearch />,
        onClick: () => {
          router.push("/learn/fts-search", "none", "replace");
        },
      });

      if (flags.video_category_channels.enabled) {
        gr[2].items.push({
          label: "Kanäle",
          icon: <BiGroup />,
          onClick: () => {
            router.push("/learn/channels", "none", "replace");
          },
        });
      }
    }
    if (flags.quizzes.enabled) {
      gr[2].items.push({
        label: "Quizze",
        icon: <BiQuestionMark />,
        onClick: () => {
          router.push("/quizzes", "none", "replace");
        },
      });
    }
    if (flags.tracker.enabled) {
      gr.push({
        label: "Tracker",
        items: [
          {
            label: "Übersicht",
            icon: <BiLeaf />,
            onClick: () => {
              router.push("/e2", "none", "replace");
            },
          },
        ],
      });
    }
    if (flags.sustainability_articles.enabled) {
      gr.push({
        label: "Nachhaltigkeit",
        items: [
          {
            label: "Was ist Nachhaltigkeit?",
            icon: <BiPlanet />,
            onClick: () => {
              router.push("/sustainability", "none", "replace");
            },
          },
          {
            label: "Artikel",
            icon: <BiFile />,
            onClick: () => {
              router.push("/sustainability/articles", "none", "replace");
            },
          },
        ],
      });
    }
    if (flags.recipes.enabled) {
      gr.push({
        label: "Rezepte",
        items: [
          {
            label: "Rezepte",
            icon: <FaUtensils />,
            onClick: () => {
              router.push("/recipes", "none", "replace");
            },
          },
          {
            label: "Mein Kochbuch",
            icon: <FaBook />,
            onClick: () => {
              router.push("/recipes/cookbook", "none", "replace");
            },
          },
          {
            label: "Neues Rezept",
            icon: <FaPlus />,
            onClick: () => {
              router.push("/recipes/create", "none", "replace");
            },
          },
        ],
      });

      if (flags.eatingplans.enabled) {
        gr[gr.length - 1].items.push({
          label: "Essenspläne",
          icon: <FaCalendar />,
          onClick: () => {
            router.push("/eatingplans", "none", "replace");
          },
        });
      }
    }
    if (flags.tools_co2_calc.enabled) {
      gr.push({
        label: "Werkzeuge",
        items: [
          {
            label: "CO2-Rechner",
            icon: <BiCalculator />,
            onClick: () => {
              router.push("/tools/co2", "none", "replace");
            },
          },
        ],
      });
    }
    if (flags.eco_projects.enabled) {
      gr.push({
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
            icon: <BiPlus />,
            onClick: () => {
              router.push("/e2-projects/new", "none", "replace");
            },
          },
          {
            label: "Projekte finden",
            icon: <BiSearch />,
            onClick: () => {
              router.push("/e2-projects/search", "none", "replace");
            },
          },
        ],
      });
    }

    if (flags.community.enabled) {
      gr.push({
        label: "Community",
        items: [
          {
            label: "Home",
            icon: <BiGroup />,
            onClick: () => {
              router.push("/community", "none", "replace");
            },
          },
          {
            label: "Neuer Blog",
            icon: <BiPen />,
            onClick: () => {
              router.push("/community/create/blog", "none", "replace");
            },
          },
          {
            label: "Nachrichten",
            icon: <BiEnvelope />,
            onClick: () => {
              router.push("/community/messages", "none", "replace");
            },
          },
          {
            label: "Mein Profil",
            icon: <BiUser />,
            onClick: () => {
              router.push(
                "/community/u/" + userInfo.username,
                "none",
                "replace",
              );
            },
          },
        ],
      });
    }

    gr.push({
      label: "Ressourcen",
      items: [
        {
          label: "Markdown-Hilfe",
          icon: <BiLogoMarkdown />,
          onClick: () => {
            router.push("/resources/md-help", "none", "replace");
          },
        },
      ],
    });

    gr = gr.filter((g) => g.items.length > 0);

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
            icon: <BiGroup />,
            onClick: () => {
              router.push("/admin/users", "none", "replace");
            },
          },
          {
            label: "Support-Anfragen",
            icon: <BiInfoCircle />,
            onClick: () => {
              router.push("/admin/support-requests", "none", "replace");
            },
          },
          {
            label: "Videos",
            icon: <BiVideo />,
            onClick: () => {
              router.push("/admin/content/videos", "none", "replace");
            },
          },
          {
            label: "Lifestyle-Vorlagen",
            icon: <BiFile />,
            onClick: () => {
              router.push("/admin/lifestyle-templates", "none", "replace");
            },
          },
          {
            label: "Interessen",
            icon: <BiLeaf />,
            onClick: () => {
              router.push("/admin/content/categories", "none", "replace");
            },
          },
        ],
      });
    }

    setGroups(gr);
    setCurrentGroups(gr);
  }, [userInfo, loggedIn, flags]);

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
      <SaveWorldModal
        title={"SaveWorld"}
        isOpen={props.isOpen}
        onClose={props.onClose}
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
            paddingBottom: "2rem",
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
      </SaveWorldModal>
    </>
  );
}
