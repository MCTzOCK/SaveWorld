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
import { Box, Flex, Heading } from "@chakra-ui/react";

export default function NavigationBar() {
  return (
    <>
      <Flex w={"100%"} bg={"black"} p={4} alignItems={"center"} gap={4}>
        <Flex gap={4} alignItems={"center"}>
          <Logo s={64} />
          <Heading fontWeight={1000} color={"primary.500"}>
            SaveWorld
          </Heading>
        </Flex>
      </Flex>
    </>
  );
}
