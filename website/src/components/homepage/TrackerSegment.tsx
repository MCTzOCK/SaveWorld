/**
 * website/src/components/homepage/TrackerSegment.tsx
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

export default function TrackerSegment() {
  return (
    <>
      <Box h={"100vh"} minH={"fit-content"} w={"100%"} mt={10}>
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
          <Box w={["100%", "60%"]}>
            <Image
              src={"/framed/calc_and_tracker.png"}
              rounded={"xl"}
              w={"100%"}
              h={"100%"}
              objectFit={"cover"}
            />
          </Box>
          <Box w={["100%", "30%"]}>
            <Heading color={"primary.500"} fontWeight={900} fontSize={"6xl"}>
              Tracken.
            </Heading>
            <Text fontSize={"3xl"}>
              Tracke deine umweltschädlichen{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Gewohnheiten
              </chakra.span>{" "}
              und berechne{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                deine CO2-Emissionen
              </chakra.span>
              . Steigere deinen{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Level
              </chakra.span>{" "}
              und{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                verbessere
              </chakra.span>{" "}
              unseren Planeten.
            </Text>
            <DownloadButton />
          </Box>
        </Flex>
      </Box>
    </>
  );
}
