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
import { REST } from "@saveworld/api-js";
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

export default function AdminStats() {
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
        setStats(res.payload.stats);
      } else {
        PopupManager.alert({
          title: "Fehler",
          description:
            "Fehler beim Laden der Statistiken: " + res.payload.error,
        });
      }
      setLoading(false);
    });
  }, []);
  return (
    <>
      <Heading size={"lg"} mb={4} color={"red.500"}>
        Statistik
      </Heading>
      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ]}
        gap={4}
      >
        <AdminStat
          title={"Benutzer"}
          value={stats.users.count + " (+" + stats.users.inLastWeek + ")"}
          icon={<FaUser />}
          subtitle={"davon aktiv: " + stats.users.active}
        />
        <AdminStat
          title={"Kategorien"}
          value={stats.content.categories}
          icon={<FaFileLines />}
        />
        <AdminStat
          title={"Videos"}
          value={stats.content.videos}
          icon={<FaVideo />}
          subtitle={"Aufrufe: " + stats.content.videosWatched}
        />
        <AdminStat
          title={"Rezepte"}
          value={stats.recipes}
          icon={<FaUtensils />}
        />
        <AdminStat
          title={"Support-Anfragen"}
          value={stats.supportRequests}
          icon={<FaHandsHelping />}
        />
        <AdminStat
          title={"Öko-Projekte"}
          value={stats.ecoProjects}
          icon={<FaProjectDiagram />}
        />
        <AdminStat
          title={"Forum Blogs"}
          value={stats.community.blogs}
          icon={<FaFile />}
        />
        <AdminStat
          title={"Forum Chats"}
          value={stats.community.chats}
          icon={<FaMessage />}
          subtitle={"Nachrichten: " + stats.community.chatMessages}
        />
        <AdminStat
          title={"Push-Nachr."}
          value={stats.pushNotifications}
          icon={<BiNotification />}
        />
      </Grid>
    </>
  );
}
