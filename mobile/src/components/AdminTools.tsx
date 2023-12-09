/**
 * mobile/src/components/AdminTools.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.12.2023
 *
 */

import * as React from "react";
import { Grid, Heading } from "@chakra-ui/react";
import HomeCardV2 from "./HomeCardV2";
import {
  FaFile,
  FaHandsHelping,
  FaRing,
  FaStarOfLife,
  FaUser,
} from "react-icons/fa";
import { FaLifeRing, FaUsers, FaUtensils, FaVideo } from "react-icons/fa6";

export default function AdminTools(props: { query: string }) {
  const tools: {
    icon: JSX.Element;
    text: string;
    url: string;
    color: string;
    newTab?: boolean;
  }[] = [
    {
      icon: <FaUser />,
      text: "Benutzer",
      url: "/admin/users",
      color: "red.500",
    },
    {
      icon: <FaHandsHelping />,
      text: "Support",
      url: "/admin/support-requests",
      color: "red.500",
    },
    {
      icon: <FaFile />,
      text: "Kategorien",
      url: "/admin/content/categories",
      color: "red.500",
    },
    {
      icon: <FaVideo />,
      text: "Videos",
      url: "/admin/content/videos",
      color: "red.500",
    },
    {
      icon: <FaStarOfLife />,
      text: "Lifestyle",
      url: "/admin/lifestyle-templates",
      color: "red.500",
    },
    {
      icon: <FaUtensils />,
      text: "Rezepte",
      url: "/admin/recipes",
      color: "red.500",
    },
  ];

  return (
    <>
      <Heading size={"lg"} mb={4} color={"red.500"}>
        Administration
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
        {tools
          .filter((tool) => {
            return tool.text.toLowerCase().includes(props.query.toLowerCase());
          })
          .map((tool, i) => {
            return (
              <HomeCardV2
                key={i}
                icon={tool.icon}
                text={tool.text}
                url={tool.url}
                color={tool.color}
                newTab={tool.newTab}
              />
            );
          })}
      </Grid>
    </>
  );
}
