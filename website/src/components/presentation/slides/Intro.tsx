/**
 * website/src/components/presentation/slides/Intro.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.02.2024
 *
 */

import * as React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import Logo from "@/components/Logo";
import SlideTitle from "@/components/presentation/SlideTitle";

export default function Intro() {
  return (
    <>
      <Flex alignItems={"center"} h={"100%"} p={10} gap={4} direction={"row"}>
        <Box w={"100%"}>
          <SlideTitle>SaveWorld</SlideTitle>
          <SlideTitle sub>Die App für Nachhaltigkeit</SlideTitle>
        </Box>
        <Box w={"70%"}>
          <Logo s={512} />
        </Box>
      </Flex>
    </>
  );
}
