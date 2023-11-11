/**
 * website/src/components/homepage/LearnSegment.tsx
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

export default function LearnSegment() {
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
              Lernen.
            </Heading>
            <Text fontSize={"3xl"}>
              Lerne mittels{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Short-Form-Content
              </chakra.span>{" "}
              und spannenden Artikeln mehr über{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Nachhaltigkeit
              </chakra.span>
              !
              <br />
              Alle Inhalte sind{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                kostenlos
              </chakra.span>
              verfügbar und werden auf Basis von{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Fakten
              </chakra.span>{" "}
              erstellt. Außerdem kannst du die{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Quellen
              </chakra.span>{" "}
              einsehen.
            </Text>
            <DownloadButton />
          </Box>

          <Box w={["100%", "60%"]}>
            <Image
              src={"/framed/sustainability.png"}
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
