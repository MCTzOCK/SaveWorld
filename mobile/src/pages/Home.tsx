/**
 * mobile/src/pages/Home.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import * as React from "react";
import Page from "../components/Page";
import { chakra, Grid, Heading } from "@chakra-ui/react";
import { useUserData } from "../hooks/useUserData";
import HomeForAnon from "../components/HomeForAnon";
import HomeCardV2 from "../components/HomeCardV2";
import {
  BiCalculator,
  BiCog,
  BiFile,
  BiGroup,
  BiInfoCircle,
  BiLeaf,
  BiMessage,
  BiQuestionMark,
  BiVideo,
} from "react-icons/bi";
import { useFlags } from "flagsmith/react";
import { FaUtensils } from "react-icons/fa6";
import { $$ } from "../translations/i18n";

export default function Home() {
  const flags = useFlags([
    "videos",
    "quizzes",
    "tracker",
    "news",
    "sustainability_articles",
    "tools_co2_calc",
    "eco_projects",
    "community",
    "recipes",
  ]);
  const { loggedIn } = useUserData();

  return (
    <>
      <Page title={$$("product.name")} noHeader>
        {loggedIn ? (
          <>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Heading
                fontSize={["6xl", "8xl"]}
                textAlign={"center"}
                fontWeight={1000}
                maxWidth={["100%", "100%", "25%"]}
              >
                {$$("page.home.title")}
              </Heading>
            </div>

            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Grid
                templateColumns={["repeat(2, 1fr)", "repeat(3, 1fr)"]}
                gap={4}
                w={"100%"}
                maxW={["600px"]}
              >
                {flags.tracker.enabled ? (
                  <HomeCardV2
                    color={"green.500"}
                    icon={<BiLeaf />}
                    text={$$("menu.tracker")}
                    url={"/e2"}
                  />
                ) : null}
                {flags.videos.enabled ? (
                  <HomeCardV2
                    color={"orange.500"}
                    icon={<BiVideo />}
                    text={$$("menu.videos")}
                    url={"/learn"}
                  />
                ) : null}
                {flags.quizzes.enabled ? (
                  <HomeCardV2
                    color={"teal.500"}
                    icon={<BiQuestionMark />}
                    text={$$("menu.quizzes")}
                    url={"/quizzes"}
                  />
                ) : null}
                <HomeCardV2
                  color={"red.500"}
                  icon={<BiInfoCircle />}
                  text={$$("menu.support")}
                  url={"/support"}
                />
                {flags.tools_co2_calc.enabled ? (
                  <HomeCardV2
                    color={"yellow.500"}
                    icon={<BiCalculator />}
                    text={$$("menu.calculator")}
                    url={"/tools/co2"}
                  />
                ) : null}
                {flags.community.enabled ? (
                  <HomeCardV2
                    color={"purple.500"}
                    icon={<BiGroup />}
                    text={$$("menu.community")}
                    url={"/community"}
                  />
                ) : null}
                {flags.recipes.enabled ? (
                  <HomeCardV2
                    color={"orange.500"}
                    icon={<FaUtensils />}
                    text={$$("menu.recipes")}
                    url={"/recipes"}
                  />
                ) : null}
                {flags.sustainability_articles.enabled ? (
                  <HomeCardV2
                    color={"blue.500"}
                    icon={<BiFile />}
                    text={$$("menu.recipes")}
                    url={"/sustainability/articles"}
                  />
                ) : null}
                <HomeCardV2
                  color={"pink.500"}
                  icon={<BiCog />}
                  text={$$("menu.settings.short")}
                  url={"/account"}
                />
                <HomeCardV2
                  color={"teal.500"}
                  icon={<BiMessage />}
                  text={$$("menu.notifications.short")}
                  url={"/notifications"}
                />
              </Grid>
            </div>
          </>
        ) : (
          <HomeForAnon />
        )}
      </Page>
    </>
  );
}
