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
  BiFlag,
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
import { $$ } from "../translations/i18n";
import { MdQueryStats } from "react-icons/md";

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
        label: $$("product.name"),
        items: [
          {
            label: $$("menu.home"),
            icon: <BiHome />,
            onClick: () => {
              router.push("/onboarding", "none", "replace");
            },
          },
          {
            label: "Language",
            icon: <BiFlag />,
            onClick: () => {
              router.push("/language", "none", "replace");
            },
          },
        ],
      },
      {
        items: [
          {
            label: $$("menu.settings"),
            icon: <BiCog />,
            onClick: () => {
              router.push("/account", "none", "replace");
            },
          },
          {
            label: $$("menu.notifications"),
            icon: <BiEnvelope />,
            onClick: () => {
              router.push("/notifications", "none", "replace");
            },
          },
          {
            label: $$("menu.help"),
            icon: <BiInfoCircle />,
            onClick: () => {
              router.push("/support", "none", "replace");
            },
          },
          {
            label: $$("menu.logout"),
            icon: <BiLogOut />,
            onClick: async () => {
              if (
                !(await PopupManager.confirmAsync({
                  title: $$("menu.logout"),
                  question: $$("menu.logout.description"),
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
        label: $$("general.account"),
      },
      {
        label: $$("menu.learn"),
        items: [],
      },
    ];

    if (flags.news.enabled) {
      gr[0].items.push({
        label: $$("page.news.title"),
        icon: <BiNews />,
        onClick: () => {
          router.push("/news", "none", "replace");
        },
      });
    }

    if (flags.videos.enabled) {
      gr[2].items.push({
        label: $$("menu.videos"),
        icon: <BiVideo />,
        onClick: () => {
          router.push("/learn", "none", "replace");
        },
      });
      gr[2].items.push({
        label: $$("control.search"),
        icon: <BiSearch />,
        onClick: () => {
          router.push("/learn/fts-search", "none", "replace");
        },
      });

      if (flags.video_category_channels.enabled) {
        gr[2].items.push({
          label: $$("pages.learn.channels"),
          icon: <BiGroup />,
          onClick: () => {
            router.push("/learn/channels", "none", "replace");
          },
        });
      }
    }
    if (flags.quizzes.enabled) {
      gr[2].items.push({
        label: $$("menu.quizzes"),
        icon: <BiQuestionMark />,
        onClick: () => {
          router.push("/quizzes", "none", "replace");
        },
      });
    }
    if (flags.tracker.enabled) {
      gr.push({
        label: $$("menu.tracker"),
        items: [
          {
            label: $$("general.overview"),
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
        label: $$("page.sustainability.title"),
        items: [
          {
            label: $$("menu.sustainability.what"),
            icon: <BiPlanet />,
            onClick: () => {
              router.push("/sustainability", "none", "replace");
            },
          },
          {
            label: $$("components.articles"),
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
        label: $$("menu.recipes"),
        items: [
          {
            label: $$("menu.recipes"),
            icon: <FaUtensils />,
            onClick: () => {
              router.push("/recipes", "none", "replace");
            },
          },
          {
            label: $$("menu.my.cookbook"),
            icon: <FaBook />,
            onClick: () => {
              router.push("/recipes/cookbook", "none", "replace");
            },
          },
          {
            label: $$("pages.recipes.create"),
            icon: <FaPlus />,
            onClick: () => {
              router.push("/recipes/create", "none", "replace");
            },
          },
        ],
      });

      if (flags.eatingplans.enabled) {
        gr[gr.length - 1].items.push({
          label: $$("menu.eatingplans"),
          icon: <FaCalendar />,
          onClick: () => {
            router.push("/eatingplans", "none", "replace");
          },
        });
      }
    }
    if (flags.tools_co2_calc.enabled) {
      gr.push({
        label: $$("menu.tools"),
        items: [
          {
            label: $$("menu.calculator"),
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
        label: $$("menu.projects"),
        items: [
          {
            label: $$("pages.e2projects.my"),
            icon: <FaProjectDiagram />,
            onClick: () => {
              router.push("/e2-projects/my", "none", "replace");
            },
          },
          {
            label: $$("pages.e2projects.create"),
            icon: <BiPlus />,
            onClick: () => {
              router.push("/e2-projects/new", "none", "replace");
            },
          },
          {
            label: $$("menu.e2projects.find"),
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
        label: $$("menu.community"),
        items: [
          {
            label: $$("menu.home"),
            icon: <BiGroup />,
            onClick: () => {
              router.push("/community", "none", "replace");
            },
          },
          {
            label: $$("pages.community.create.blog.title"),
            icon: <BiPen />,
            onClick: () => {
              router.push("/community/create/blog", "none", "replace");
            },
          },
          {
            label: $$("menu.notifications"),
            icon: <BiEnvelope />,
            onClick: () => {
              router.push("/community/messages", "none", "replace");
            },
          },
          {
            label: $$("menu.community.my.profile"),
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
      label: $$("menu.resources"),
      items: [
        {
          label: $$("menu.markdown.help"),
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
        label: $$("menu.admin"),
        color: "var(--ion-color-danger)",
        items: [
          {
            label: $$("general.overview"),
            icon: <FaHammer />,
            onClick: () => {
              router.push("/admin", "none", "replace");
            },
          },
          {
            label: "ADP",
            icon: <MdQueryStats />,
            onClick: () => {
              router.push("/admin/adp", "none", "replace");
            },
          },
          {
            label: $$("user.user"),
            icon: <BiGroup />,
            onClick: () => {
              router.push("/admin/users", "none", "replace");
            },
          },
          {
            label: $$("components.admin.stats.support"),
            icon: <BiInfoCircle />,
            onClick: () => {
              router.push("/admin/support-requests", "none", "replace");
            },
          },
          {
            label: $$("menu.videos"),
            icon: <BiVideo />,
            onClick: () => {
              router.push("/admin/content/videos", "none", "replace");
            },
          },
          {
            label: $$("menu.lifestyle.templates"),
            icon: <BiFile />,
            onClick: () => {
              router.push("/admin/lifestyle-templates", "none", "replace");
            },
          },
          {
            label: $$("menu.interests"),
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
        title={$$("product.name")}
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
          placeholder={$$("control.search")}
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
