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

export default function Home() {
  const { loggedIn } = useUserData();

  return (
    <>
      <Page title={"SaveWorld"} noHeader>
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
                maxWidth={["100%", "100%", "75%"]}
              >
                Rette die <br />
                Welt!
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
                <HomeCardV2
                  color={"green.500"}
                  icon={<BiLeaf />}
                  text={"Tracker"}
                  url={"/e2"}
                />
                <HomeCardV2
                  color={"orange.500"}
                  icon={<BiVideo />}
                  text={"Videos"}
                  url={"/learn"}
                />
                <HomeCardV2
                  color={"teal.500"}
                  icon={<BiQuestionMark />}
                  text={"Quizze"}
                  url={"/quizzes"}
                />
                <HomeCardV2
                  color={"red.500"}
                  icon={<BiInfoCircle />}
                  text={"Support"}
                  url={"/support"}
                />
                <HomeCardV2
                  color={"yellow.500"}
                  icon={<BiCalculator />}
                  text={"Rechner"}
                  url={"/tools/co2"}
                />
                <HomeCardV2
                  color={"purple.500"}
                  icon={<BiGroup />}
                  text={"Forum"}
                  url={"/community"}
                />
                <HomeCardV2
                  color={"blue.500"}
                  icon={<BiFile />}
                  text={"Artikel"}
                  url={"/sustainability/articles"}
                />
                <HomeCardV2
                  color={"pink.500"}
                  icon={<BiCog />}
                  text={"Einst."}
                  url={"/account"}
                />
                <HomeCardV2
                  color={"teal.500"}
                  icon={<BiMessage />}
                  text={"Nachr."}
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
