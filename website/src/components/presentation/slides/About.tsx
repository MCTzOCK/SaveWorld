/**
 * website/src/components/presentation/slides/About.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.02.2024
 *
 */

import * as React from "react";
import SlideTitle from "@/components/presentation/SlideTitle";
import {
  Box,
  Flex,
  Image,
  ListItem,
  Stack,
  UnorderedList,
} from "@chakra-ui/react";
import SlideList from "@/components/presentation/SlideList";

export default function About() {
  return (
    <Box p={10}>
      <SlideTitle>Was ist SaveWorld?</SlideTitle>
      <Flex w={"100%"}>
        <SlideList
          lines={[
            "App, die Jugendlichen Nachhaltigkeit näher bringt",
            "Kurze Videos, um praktische Tipps zu geben",
            "Längere Artikel, um globalen Zusammenhängen zu verstehen",
            "Community, um sich auszutauschen und zu vernetzen",
            "Lokale Projekte, um sich zu engagieren",
            "Tracker, um den eigenen Fortschritt zu sehen",
          ]}
        />
        <Box flex={"70%"}>
          <Image src={"/assets/pitch/rw/saveworld_dreieck.png"} w={600} />
        </Box>
      </Flex>
    </Box>
  );
}
