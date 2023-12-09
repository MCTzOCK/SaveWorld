/**
 * mobile/src/components/AdminInternTools.tsx
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
import { FaDatabase, FaDocker, FaFileLines, FaToggleOn } from "react-icons/fa6";
import { MdHttps } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import { BiNotification } from "react-icons/bi";
import { SiPosthog } from "react-icons/si";

export default function AdminInternTools(props: { query: string }) {
  const tools: {
    icon: JSX.Element;
    text: string;
    url: string;
    color: string;
    newTab?: boolean;
  }[] = [
    {
      icon: <FaDatabase />,
      text: "S3 Admin",
      url: "https://s3.ben-siebert.com",
      color: "purple.500",
    },
    {
      icon: <FaDocker />,
      text: "Portainer",
      url: "https://portainer.cluster.ben-siebert.com",
      color: "blue.500",
    },
    {
      icon: <MdHttps />,
      text: "NGINX",
      url: "https://http.cluster.ben-siebert.com",
      color: "brand.500",
    },
    {
      icon: <HiStatusOnline />,
      text: "Server Status",
      url: "https://status.saveworld.one",
      color: "red.500",
    },
    {
      icon: <BiNotification />,
      text: "OneSignal",
      url: "https://dashboard.onesignal.com/apps/7575751a-432d-44b0-baa2-84dcfc925f45",
      color: "yellow.500",
    },
    {
      icon: <FaToggleOn />,
      text: "Features",
      url: "https://features.saveworld.one",
      color: "pink.500",
    },
    {
      icon: <FaFileLines />,
      text: "Content",
      url: "https://content.saveworld.one",
      color: "blue.500",
    },
    {
      icon: <SiPosthog />,
      text: "Posthog",
      url: "https://app.posthog.com",
      color: "purple.500",
    },
  ];

  return (
    <>
      <Heading size={"lg"} mb={4} color={"red.500"}>
        Interne Werkzeuge
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
          .filter((t) =>
            t.text.toLowerCase().includes(props.query.toLowerCase()),
          )
          .map((t) => {
            return (
              <>
                <HomeCardV2
                  icon={t.icon}
                  text={t.text}
                  url={t.url}
                  color={t.color}
                  newTab
                />
              </>
            );
          })}
      </Grid>
    </>
  );
}
