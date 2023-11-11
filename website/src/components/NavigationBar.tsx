/**
 * website/src/components/NavigationBar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import Logo from "@/components/Logo";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import DownloadButton from "@/components/DownloadButton";

export default function NavigationBar() {
  return (
    <>
      <Flex
        w={"100%"}
        bg={"black"}
        p={4}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={4}
        direction={["column", "row"]}
      >
        <Flex gap={4} alignItems={"center"}>
          <Logo s={64} />
          <Heading fontWeight={1000} color={"primary.500"}>
            SaveWorld
          </Heading>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <DownloadButton />
        </Flex>
      </Flex>
    </>
  );
}
