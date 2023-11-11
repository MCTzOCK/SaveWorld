/**
 * website/src/components/homepage/CommunitySegment.tsx
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

export default function CommunitySegment() {
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
              src={"/framed/community.png"}
              rounded={"xl"}
              w={"100%"}
              h={"100%"}
              objectFit={"cover"}
            />
          </Box>
          <Box w={["100%", "30%"]}>
            <Heading color={"primary.500"} fontWeight={900} fontSize={"6xl"}>
              Austauschen.
            </Heading>
            <Text fontSize={"3xl"}>
              Blogge über deinen{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                Fortschritt
              </chakra.span>{" "}
              hin zu einem{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                nachhaltigen Leben
              </chakra.span>
              . Chatte mit{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                anderen Benutzern
              </chakra.span>{" "}
              und{" "}
              <chakra.span fontWeight={900} color={"primary.500"}>
                lerne
              </chakra.span>{" "}
              von diesem.
            </Text>
            <DownloadButton />
          </Box>
        </Flex>
      </Box>
    </>
  );
}
