/**
 * mobile/src/components/HomeForAnon.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.10.2023
 *
 */

import * as React from "react";
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import HomeCard from "./HomeCard";
import { FaEarthEurope } from "react-icons/fa6";
import { IonCard, IonCardContent, useIonRouter } from "@ionic/react";

export default function HomeForAnon() {
  const router = useIonRouter();
  return (
    <>
      <Flex
        flexDirection={"column"}
        height={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Image
          src={"/assets/images/earth-shattered.png"}
          width={"100%"}
          height={"100vh"}
          objectFit={"cover"}
          position={"absolute"}
          zIndex={-1}
          filter={"blur(10px)"}
          alt={""}
        />
        <Stack
          textAlign={["center", "left"]}
          w={"fit-content"}
          spacing={6}
          maxW={"100%"}
        >
          <Heading
            fontSize={["5xl", "8xl"]}
            textAlign={"center"}
            fontWeight={1000}
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            Rette&nbsp;unseren&nbsp;
            <span
              style={{
                color: "var(--ion-color-success)",
                textShadow: "0px 0px 40px rgba(0,255,0,1)",
                wordWrap: "normal",
              }}
            >
              Planeten
            </span>
            .
          </Heading>
          <Heading
            fontSize={["5xl", "8xl"]}
            textAlign={"center"}
            fontWeight={1000}
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            Schütze die&nbsp;
            <span
              style={{
                color: "var(--ion-color-success)",
                textShadow: "0px 0px 40px rgba(0,255,0,1)",
              }}
            >
              Umwelt
            </span>
            .
          </Heading>
          <Flex justifyContent={["center", "flex-end"]}>
            <Box
              backgroundColor={"var(--ion-color-success)"}
              border={"none"}
              borderRadius={"12px"}
              padding={"1rem"}
              fontFamily={"Inter, sans-serif"}
              fontWeight={900}
              fontSize={"4xl"}
              w={"fit-content"}
              cursor={"pointer"}
              _hover={{
                backgroundColor: "var(--ion-color-success-shade)",
              }}
              onClick={() => {
                router.push("/register", "none", "push");
              }}
            >
              Jetzt loslegen
            </Box>
          </Flex>
        </Stack>
      </Flex>
    </>
  );
}
