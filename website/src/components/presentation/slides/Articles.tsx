/**
 * website/src/components/presentation/slides/Articles.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.02.2024
 *
 */

import * as React from "react";
import Slide from "@/components/presentation/Slide";
import SlideTitle from "@/components/presentation/SlideTitle";
import { Box, Flex, Heading, Image } from "@chakra-ui/react";

export default function Articles() {
  return (
    <>
      <Slide>
        <SlideTitle>Artikel</SlideTitle>
        <Flex w={"100%"} justifyContent={"center"} alignItems={"center"}>
          <Box w={"100%"} h={"100%"} position={"relative"}>
            <Image
              src={"/assets/pitch/rw/blank_phone.png"}
              w={400}
              zIndex={-1}
            />
            <Box bg={"primary.500"} position={"absolute"} top={0}></Box>
          </Box>
        </Flex>
      </Slide>
    </>
  );
}
