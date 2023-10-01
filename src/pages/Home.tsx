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
import { Card, CardBody, Heading, chakra, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";
import { FaLeaf, FaPeopleGroup, FaVideo } from "react-icons/fa6";
import { IonCard, IonCardContent } from "@ionic/react";
import HomeCard from "../components/HomeCard";
import { FaInfoCircle } from "react-icons/fa";
import { useRedirectForAnon } from "../hooks/useRedirectForAnon";
import { useUserData } from "../hooks/useUserData";
import HomeForAnon from "../components/HomeForAnon";

export default function Home() {
  const { loggedIn } = useUserData();

  const [hasEcoDetailsForToday, setHasEcoDetailsForToday] =
    React.useState<boolean>(true);

  useEffect(() => {
    REST.Lifestyle.summary(
      localStorage.getItem("token") as string,
      new Date().toISOString(),
    ).then((res) => {
      if (res.status !== 200) {
        setHasEcoDetailsForToday(false);
      }
    });
  }, []);

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
                style={{
                  fontFamily: "Inter, sans-serif",
                }}
                maxWidth={["100%", "100%", "75%"]}
              >
                Verbessere &nbsp;die
                <br />
                <span
                  style={{
                    color: "var(--ion-color-success)",
                    textShadow: "0px 0px 40px rgba(0,255,0,1)",
                  }}
                >
                  Welt
                </span>
                .
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
              <div>
                {!hasEcoDetailsForToday && (
                  <>
                    <HomeCard
                      icon={<FaLeaf />}
                      text={
                        "Gib Daten zu deinem Tag ein, um deine Ziele zu tracken!"
                      }
                      url={"/e2"}
                    />
                  </>
                )}
                <HomeCard
                  icon={<FaVideo />}
                  text={
                    "Schau dir Videos an, um mehr über Nachhaltigkeit zu lernen!"
                  }
                  url={"/learn"}
                />
                <HomeCard
                  icon={<FaPeopleGroup />}
                  text={
                    "Tausche dich mit anderen aus, die auch die Welt verbessern wollen!"
                  }
                  url={"/community"}
                />
                <HomeCard
                  icon={<FaInfoCircle />}
                  text={"Du hast Fragen? Wir haben Antworten!"}
                  url={"/support"}
                />
              </div>
            </div>
          </>
        ) : (
          <HomeForAnon />
        )}
      </Page>
    </>
  );
}
