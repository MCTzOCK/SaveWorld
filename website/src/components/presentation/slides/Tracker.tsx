/**
 * website/src/components/presentation/slides/Tracker.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.02.2024
 *
 */

import * as React from "react";
import SlideTitle from "@/components/presentation/SlideTitle";
import Slide from "@/components/presentation/Slide";
import { Box, Flex, Image } from "@chakra-ui/react";
import SlideList from "@/components/presentation/SlideList";

export default function Tracker() {
  return (
    <>
      <Slide>
        <SlideTitle>Tracker</SlideTitle>
        <Flex w={"100%"}>
          <SlideList
            lines={["Täglich Daten eintragen", "Automatische Ziele", "Analyse"]}
          />
          <Box flex={"70%"}>
            <Image
              src={"/assets/pitch/rw/slide_tracker.png"}
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
