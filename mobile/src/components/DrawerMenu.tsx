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
  FaFileLines,
  FaGamepad,
  FaHammer,
  FaLeaf,
  FaLink,
  FaNewspaper,
  FaPeopleGroup,
  FaPerson,
  FaPlus,
  FaQrcode,
  FaQuestion,
  FaRightFromBracket,
  FaRobot,
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
import { BsFileBarGraph } from "react-icons/bs";
import { RiMindMap } from "react-icons/ri";
import { Perms } from "../Perms";

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

  const { userInfo, loggedIn, permission_flags } = useUserData();

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
              router.push("/onboarding", "forward", "push");
            },
          },
          {
            label: "Language",
            icon: <BiFlag />,
            onClick: () => {
              router.push("/language", "forward", "push");
            },
          },
          {
            label: $$("pages.fooddata.title"),
            icon: <FaQrcode />,
            onClick: () => {
              router.push("/fooddata", "forward", "push");
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
              router.push("/account", "forward", "push");
            },
          },
          {
            label: $$("menu.help"),
            icon: <BiInfoCircle />,
            onClick: () => {
              router.push("/support", "forward", "push");
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

              if (isPlatform("capacitor")) {
                OneSignal.logout();
              }
              localStorage.removeItem("token");
              router.push("/login", "forward", "push");
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

    if (
      permission_flags.find((p) => p.permission === Perms.AI_SINGLE_REQUEST)
        ?.allowed
    ) {
      gr[0].items.push({
        label: $$("pages.ai.title"),
        icon: <FaRobot />,
        onClick: () => {
          router.push("/ai", "forward", "push");
        },
      });
    }

    if (
      permission_flags.find(
        (p) => p.permission === Perms.SCHOOL_CLASSES_RECEIVE,
      )?.allowed
    ) {
      gr[0].items.push({
        label: $$("pages.teachers.area"),
        icon: <FaBook />,
        onClick: () => {
          router.push("/teachers", "forward", "push");
        },
      });
    }

    if (flags.news.enabled) {
      gr[0].items.push({
        label: $$("page.news.title"),
        icon: <BiNews />,
        onClick: () => {
          router.push("/news", "forward", "push");
        },
      });
    }

    if (
      permission_flags.find((p) => p.permission === Perms.NOTIFICATIONS_MY)
        ?.allowed
    ) {
      gr[1].items.push({
        label: $$("menu.notifications"),
        icon: <BiEnvelope />,
        onClick: () => {
          router.push("/notifications", "forward", "push");
        },
      });
    }

    if (
      flags.videos.enabled &&
      permission_flags.find(
        (p) => (p.permission = Perms.CONTENT_VIDEOS_SUGGESTED),
      )?.allowed
    ) {
      gr[2].items.push({
        label: $$("menu.videos"),
        icon: <BiVideo />,
        onClick: () => {
          router.push("/learn", "forward", "push");
        },
      });
      gr[2].items.push({
        label: $$("control.search"),
        icon: <BiSearch />,
        onClick: () => {
          router.push("/learn/fts-search", "forward", "push");
        },
      });

      if (flags.video_category_channels.enabled) {
        gr[2].items.push({
          label: $$("pages.learn.channels"),
          icon: <BiGroup />,
          onClick: () => {
            router.push("/learn/channels", "forward", "push");
          },
        });
      }
    }
    if (flags.quizzes.enabled) {
      gr[2].items.push({
        label: $$("menu.quizzes"),
        icon: <BiQuestionMark />,
        onClick: () => {
          router.push("/quizzes", "forward", "push");
        },
      });
    }
    gr[2].items.push({
      label: $$("components.learning.graphs"),
      icon: <RiMindMap />,
      onClick: () => {
        router.push("/learn/graphs", "forward", "push");
      },
    });
    if (
      flags.tracker.enabled &&
      permission_flags.find((p) => p.permission === Perms.LIFESTYLE_MY_DAY)
        ?.allowed
    ) {
      gr.push({
        label: $$("menu.tracker"),
        items: [
          {
            label: $$("general.overview"),
            icon: <BiLeaf />,
            onClick: () => {
              router.push("/e2", "forward", "push");
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
              router.push("/sustainability", "forward", "push");
            },
          },
          {
            label: $$("components.articles"),
            icon: <BiFile />,
            onClick: () => {
              router.push("/sustainability/articles", "forward", "push");
            },
          },
        ],
      });
    }
    if (
      flags.recipes.enabled &&
      permission_flags.find((p) => p.permission === Perms.RECIPES_ALL)?.allowed
    ) {
      gr.push({
        label: $$("menu.recipes"),
        items: [
          {
            label: $$("menu.recipes"),
            icon: <FaUtensils />,
            onClick: () => {
              router.push("/recipes", "forward", "push");
            },
          },
          {
            label: $$("menu.my.cookbook"),
            icon: <FaBook />,
            onClick: () => {
              router.push("/recipes/cookbook", "forward", "push");
            },
          },
          {
            label: $$("pages.recipes.create"),
            icon: <FaPlus />,
            onClick: () => {
              router.push("/recipes/create", "forward", "push");
            },
          },
        ],
      });

      if (
        flags.eatingplans.enabled &&
        permission_flags.find((p) => p.permission === Perms.EATINGPLAN_GET)
          ?.allowed
      ) {
        gr[gr.length - 1].items.push({
          label: $$("menu.eatingplans"),
          icon: <FaCalendar />,
          onClick: () => {
            router.push("/eatingplans", "forward", "push");
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
              router.push("/tools/co2", "forward", "push");
            },
          },
        ],
      });
    }
    if (flags.eco_projects.enabled) {
      gr.push({
        label: $$("menu.projects"),
        items: [],
      });

      if (
        permission_flags.find((p) => p.permission === Perms.E2PROJECTS_MY)
          ?.allowed
      ) {
        gr[gr.length - 1].items.push({
          label: $$("pages.e2projects.my"),
          icon: <FaProjectDiagram />,
          onClick: () => {
            router.push("/e2-projects/my", "forward", "push");
          },
        });
      }

      if (
        permission_flags.find((p) => p.permission === Perms.E2PROJECTS_CREATE)
          ?.allowed
      ) {
        gr[gr.length - 1].items.push({
          label: $$("pages.e2projects.create"),
          icon: <BiPlus />,
          onClick: () => {
            router.push("/e2-projects/new", "forward", "push");
          },
        });
      }

      if (
        permission_flags.find((p) => p.permission === Perms.E2PROJECTS_MY)
          ?.allowed
      ) {
        gr[gr.length - 1].items.push({
          label: $$("menu.e2projects.find"),
          icon: <BiSearch />,
          onClick: () => {
            router.push("/e2-projects/search", "forward", "push");
          },
        });
      }
    }

    if (flags.community.enabled) {
      gr.push({
        label: $$("menu.community"),
        items: [],
      });

      if (
        permission_flags.find((p) => p.permission === Perms.COMMUNITY_SUGGESTED)
          ?.allowed
      ) {
        gr[gr.length - 1].items.push({
          label: $$("menu.home"),
          icon: <BiGroup />,
          onClick: () => {
            router.push("/community", "forward", "push");
          },
        });
      }

      if (
        permission_flags.find(
          (p) => p.permission === Perms.COMMUNITY_CREATE_BLOG,
        )?.allowed
      ) {
        gr[gr.length - 1].items.push({
          label: $$("pages.community.create.blog.title"),
          icon: <BiPen />,
          onClick: () => {
            router.push("/community/create/blog", "forward", "push");
          },
        });
      }

      if (
        permission_flags.find(
          (p) => p.permission === Perms.COMMUNITY_RECEIVE_PROFILE,
        )?.allowed
      ) {
        gr[gr.length - 1].items.push({
          label: $$("menu.community.my.profile"),
          icon: <BiUser />,
          onClick: () => {
            router.push("/community/u/" + userInfo.username, "forward", "push");
          },
        });

        gr[gr.length - 1].items.push({
          label: $$("menu.notifications"),
          icon: <BiEnvelope />,
          onClick: () => {
            router.push("/community/messages", "forward", "push");
          },
        });
      }
    }

    if (
      permission_flags.find((p) => p.permission === Perms.GAMES_LEADERBOARD)
        ?.allowed
    ) {
      gr.push({
        label: $$("pages.games.title"),
        items: [
          {
            label: $$("pages.games.title"),
            icon: <FaGamepad />,
            onClick: () => {
              router.push("/games", "forward", "push");
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
            router.push("/resources/md-help", "forward", "push");
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
              router.push("/admin", "forward", "push");
            },
          },
          {
            label: "ADP",
            icon: <MdQueryStats />,
            onClick: () => {
              router.push("/admin/adp", "forward", "push");
            },
          },
          {
            label: "Custom Path",
            icon: <FaLink />,
            onClick: async () => {
              const path = await PopupManager.promptAsync({
                title: "Custom Path",
                helperText: "Enter the path",
              });

              if (!path) return;

              router.push(path, "forward", "push");
            },
          },
          {
            label: $$("user.user"),
            icon: <BiGroup />,
            onClick: () => {
              router.push("/admin/users", "forward", "push");
            },
          },
          {
            label: $$("components.admin.stats.support"),
            icon: <BiInfoCircle />,
            onClick: () => {
              router.push("/admin/support-requests", "forward", "push");
            },
          },
          {
            label: $$("menu.videos"),
            icon: <BiVideo />,
            onClick: () => {
              router.push("/admin/content/videos", "forward", "push");
            },
          },
          {
            label: $$("menu.lifestyle.templates"),
            icon: <BiFile />,
            onClick: () => {
              router.push("/admin/lifestyle-templates", "forward", "push");
            },
          },
          {
            label: $$("menu.interests"),
            icon: <BiLeaf />,
            onClick: () => {
              router.push("/admin/content/categories", "forward", "push");
            },
          },
          {
            label: $$("components.articles"),
            icon: <FaFileLines />,
            onClick: () => {
              router.push("/admin/articles", "forward", "push");
            },
          },
          {
            label: $$("menu.quizzes"),
            icon: <FaQuestion />,
            onClick: () => {
              router.push("/admin/quizzes", "forward", "push");
            },
          },
          {
            label: $$("components.learning.graphs"),
            icon: <RiMindMap />,
            onClick: () => {
              router.push("/admin/learning-graphs", "forward", "push");
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
