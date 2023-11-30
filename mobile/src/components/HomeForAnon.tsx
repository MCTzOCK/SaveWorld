/**
 * mobile/src/components/HomeForAnon.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.10.2023
 *
 */

import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import HomeCard from "./HomeCard";
import { FaEarthEurope } from "react-icons/fa6";
import { IonCard, IonCardContent, useIonRouter } from "@ionic/react";

export default function HomeForAnon() {
  const router = useIonRouter();

  return (
    <Box h={"100vh"} minH={"fit-content"} w={"100%"}>
      <Flex
        w={"100%"}
        h={"100%"}
        minH={"fit-content"}
        alignItems={"center"}
        justifyContent={"center"}
        direction={["column", "row"]}
        gap={4}
      >
        <Image
          src={"/maksim-shutov-cj0VP7HzQbw-unsplash.jpg"}
          width={"100%"}
          height={"100vh"}
          objectFit={"cover"}
          position={"absolute"}
          zIndex={-1}
          filter={"blur(10px)"}
          alt={""}
        />
        <Flex justifyContent={"center"} direction={"column"} gap={4} p={4}>
          <Heading
            color={"brand.500"}
            fontSize={["6xl", "8xl"]}
            fontWeight={900}
          >
            SaveWorld
          </Heading>
          <Text fontSize={["2xl", "4xl"]} fontWeight={700}>
            Unser Planet braucht deine{" "}
            <chakra.span color={"brand.500"} fontWeight={900}>
              Hilfe
            </chakra.span>
            !
          </Text>
          <Text fontSize={["2xl", "4xl"]} fontWeight={700}>
            Leiste deinen{" "}
            <chakra.span color={"brand.500"} fontWeight={900}>
              Beitrag
            </chakra.span>
            !
          </Text>
          <ButtonGroup w={"100%"} justifyContent={["center", "right"]}>
            <Button
              backgroundColor={"brand.600"}
              size={"lg"}
              _hover={{ backgroundColor: "brand.500" }}
              _active={{ backgroundColor: "brand.700" }}
              as={Link}
              href={"/register"}
              fontSize={"xl"}
            >
              Los geht's
            </Button>
          </ButtonGroup>
        </Flex>
      </Flex>
    </Box>
  );
}
