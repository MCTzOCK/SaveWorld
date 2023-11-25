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
import { Card, CardBody, Heading, chakra, Text, Grid } from "@chakra-ui/react";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";
import {
  FaFileLines,
  FaLeaf,
  FaMessage,
  FaPeopleGroup,
  FaVideo,
} from "react-icons/fa6";
import { IonCard, IonCardContent } from "@ionic/react";
import HomeCard from "../components/HomeCard";
import {
  FaCalculator,
  FaCogs,
  FaHandPaper,
  FaInfoCircle,
} from "react-icons/fa";
import { useRedirectForAnon } from "../hooks/useRedirectForAnon";
import { useUserData } from "../hooks/useUserData";
import HomeForAnon from "../components/HomeForAnon";
import HomeCardV2 from "../components/HomeCardV2";

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
                Rette &nbsp;die
                <br />
                <chakra.span
                  style={{
                    textShadow: "0px 0px 40px rgba(0,255,0,1)",
                  }}
                >
                  Welt!
                </chakra.span>
              </Heading>
            </div>

            <div
              style={{
                marginTop: "4.5rem",
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
                  icon={<FaLeaf />}
                  text={"Tracker"}
                  url={"/e2"}
                />
                <HomeCardV2
                  color={"orange.500"}
                  icon={<FaVideo />}
                  text={"Videos"}
                  url={"/learn"}
                />
                <HomeCardV2
                  color={"red.500"}
                  icon={<FaInfoCircle />}
                  text={"Support"}
                  url={"/support"}
                />
                <HomeCardV2
                  color={"yellow.500"}
                  icon={<FaCalculator />}
                  text={"Rechner"}
                  url={"/tools/co2"}
                />
                <HomeCardV2
                  color={"purple.500"}
                  icon={<FaPeopleGroup />}
                  text={"Forum"}
                  url={"/community"}
                />
                <HomeCardV2
                  color={"blue.500"}
                  icon={<FaFileLines />}
                  text={"Artikel"}
                  url={"/sustainability/articles"}
                />
                <HomeCardV2
                  color={"pink.500"}
                  icon={<FaCogs />}
                  text={"Einst."}
                  url={"/account"}
                />
                <HomeCardV2
                  color={"teal.500"}
                  icon={<FaMessage />}
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
