/**
 * website/src/components/presentation/slides/Content.tsx
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
import SlideList from "@/components/presentation/SlideList";
import { Box, Flex, Image } from "@chakra-ui/react";

export default function Content() {
  return (
    <>
      <Slide>
        <SlideTitle>Recherche</SlideTitle>
        <Flex w={"100%"}>
          <SlideList
            lines={[
              "Verwendung seriöser Quellen",
              "Faktencheck",
              "Quellenangaben",
            ]}
          />
          <Box flex={"70%"}>
            <Image
              src={"/assets/pitch/rw/slide_content_articles.png"}
              w={400}
              aspectRatio={9 / 16}
              rounded={"xl"}
            />
          </Box>
        </Flex>
      </Slide>
    </>
  );
}
