/**
 * mobile/src/components/AdminStats.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.12.2023
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../util/PopupManager";
import { Grid, Heading } from "@chakra-ui/react";
import AdminStat from "./AdminStat";
import {
  FaFile,
  FaHandsHelping,
  FaProjectDiagram,
  FaUser,
} from "react-icons/fa";
import { FaFileLines, FaMessage, FaUtensils, FaVideo } from "react-icons/fa6";
import { BiNotification } from "react-icons/bi";
import { $$ } from "../translations/i18n";

export default function AdminStats(props: { query: string }) {
  const [stats, setStats] = useState<{
    users: {
      count: number;
      inLastWeek: number;
      active: number;
    };
    content: {
      categories: number;
      videos: number;
      videosWatched: number;
    };
    recipes: number;
    supportRequests: number;
    ecoProjects: number;
    community: {
      blogs: number;
      chats: number;
      chatMessages: number;
    };
    pushNotifications: number;
  }>({
    users: {
      count: 0,
      inLastWeek: 0,
      active: 0,
    },
    content: {
      categories: 0,
      videos: 0,
      videosWatched: 0,
    },
    recipes: 0,
    supportRequests: 0,
    ecoProjects: 0,
    community: {
      blogs: 0,
      chats: 0,
      chatMessages: 0,
    },
    pushNotifications: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    REST.Admin.stats(localStorage.getItem("token") as string).then((res) => {
      if (res.status === 200) {
        let s = res.payload.stats;
        setStats(res.payload.stats);

        const dps: typeof displayStats = [
          {
            icon: <FaUser />,
            title: $$("components.admin.stats.users"),
            value: s.users.count + " (+" + s.users.inLastWeek + ")",
            subtitle: $$(
              "components.admin.stats.users.subtitle",
              s.users.active,
            ),
          },
          {
            icon: <FaFileLines />,
            title: $$("components.video.create.categories"),
            value: s.content.categories,
          },
          {
            icon: <FaVideo />,
            title: $$("components.admin.stats.videos"),
            value: s.content.videos,
            subtitle: $$(
              "components.admin.stats.videos.subtitle",
              s.content.videosWatched,
            ),
          },
          {
            icon: <FaUtensils />,
            title: $$("components.admin.stats.recipes"),
            value: s.recipes,
          },
          {
            icon: <FaHandsHelping />,
            title: $$("components.admin.stats.support"),
            value: s.supportRequests,
          },
          {
            icon: <FaProjectDiagram />,
            title: $$("components.admin.stats.projects"),
            value: s.ecoProjects,
          },
          {
            icon: <FaFile />,
            title: $$("components.admin.stats.blogs"),
            value: s.community.blogs,
          },
          {
            icon: <FaMessage />,
            title: $$("components.admin.stats.chats"),
            value: s.community.chats,
            subtitle: $$(
              "components.admin.stats.chats.subtitle",
              s.community.chatMessages,
            ),
          },
          {
            icon: <BiNotification />,
            title: $$("components.admin.stats.push.notifications"),
            value: s.pushNotifications,
          },
        ];

        setDisplayStats(dps);
      } else {
        PopupManager.alert({
          title: $$("control.error"),
          description: $$(
            "components.admin.stats.error.loading",
            res.payload.error,
          ),
        });
      }
      setLoading(false);
    });
  }, []);

  const [displayStats, setDisplayStats] = useState<
    {
      icon: React.ReactNode;
      title: string;
      value: string;
      subtitle?: string;
    }[]
  >([]);

  return (
    <>
      <Heading size={"lg"} mb={4} color={"red.500"}>
        {$$("components.admin.stats")}
      </Heading>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        gap={4}
      >
        {displayStats
          .filter((s) =>
            s.title.toLowerCase().includes(props.query.toLowerCase()),
          )
          .map((s) => {
            return (
              <>
                <AdminStat
                  title={s.title}
                  value={s.value}
                  icon={s.icon}
                  subtitle={s.subtitle}
                />
              </>
            );
          })}
      </Grid>
    </>
  );
}
