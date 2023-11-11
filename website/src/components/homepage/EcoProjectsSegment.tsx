/**
 * website/src/components/homepage/EcoProjectsSegment.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import { Box, chakra, Flex, Heading, Image, Text } from "@chakra-ui/react";
import DownloadButton from "@/components/DownloadButton";

export default function EcoProjectsSegment() {
  return (
    <>
      <Box h={"100vh"} minH={"fit-content"} w={"100%"} mt={8}>
        <Flex
          w={"100%"}
          h={"100%"}
          minH={"fit-content"}
          alignItems={"center"}
          justifyContent={"center"}
          direction={["column", "row"]}
          gap={4}
          p={4}
        >
          <Box w={["100%", "30%"]}>
            <Heading color={"primary.500"} fontWeight={900} fontSize={"6xl"}>
              Handeln.
            </Heading>
            <Text fontSize={"3xl"}>
              Plane eigene{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Ökologie Projekte
              </chakra.span>{" "}
              und arbeite mit{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                tollen Menschen
              </chakra.span>{" "}
              zusammen!
              <br />
              Finde Projekte{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                in deiner Nähe
              </chakra.span>{" "}
              um dich zu engagieren.{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Fakten
              </chakra.span>{" "}
              erstellt. Organisiere deine Projekte mit{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                erstklassigen Werkzeugen
              </chakra.span>
              .
            </Text>
            <DownloadButton />
          </Box>

          <Box w={["100%", "60%"]}>
            <Image
              src={"/framed/eco_projects.png"}
              rounded={"xl"}
              w={"100%"}
              h={"100%"}
              objectFit={"cover"}
            />
          </Box>
        </Flex>
      </Box>
    </>
  );
}
