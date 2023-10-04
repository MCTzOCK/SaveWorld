/**
 * mobile/src/pages/NotFound.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.08.2023
 *
 */

import * as React from "react";
import Page from "../components/Page";
import { IonButton } from "@ionic/react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Page title={""}>
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box maxW={["100%", "40%"]}>
          <Heading
            fontSize={["6xl", "8xl"]}
            textAlign={"center"}
            fontWeight={1000}
            style={{
              fontFamily: "Inter, sans-serif",
            }}
            maxWidth={"100%"}
          >
            <span
              style={{
                color: "var(--ion-color-success)",
                textShadow: "0px 0px 40px rgba(0,255,0,1)",
              }}
            >
              404
            </span>
          </Heading>
          <Text
            style={{
              fontFamily: "Inter, sans-serif",
            }}
            fontSize={"3xl"}
            padding={"1rem"}
            fontWeight={900}
          >
            Es sieht so aus, als ob du dich verlaufen hast!
          </Text>
          <Flex flexDirection={"row"} alignItems={"center"} gap={"2rem"}>
            <IonButton
              style={{ width: "100%" }}
              color={"success"}
              routerLink={"/support"}
            >
              Support
            </IonButton>
            <IonButton
              style={{ width: "100%" }}
              color={"success"}
              routerLink={"/"}
            >
              nach Hause telefonieren
            </IonButton>
          </Flex>
        </Box>
      </Flex>
    </Page>
  );
}
