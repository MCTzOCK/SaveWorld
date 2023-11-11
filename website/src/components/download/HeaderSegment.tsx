/**
 * website/src/components/download/HeaderSegment.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
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
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { FaApple, FaGlobe } from "react-icons/fa";

export default function HeaderSegment() {
  return (
    <>
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
              color={"primary.500"}
              fontSize={["6xl", "8xl"]}
              fontWeight={900}
            >
              SaveWorld
            </Heading>
            <Text fontSize={["2xl", "4xl"]} fontWeight={700}>
              Zum <chakra.span color={"primary.500"}>herunterladen</chakra.span>{" "}
              musst du nur noch deine{" "}
              <chakra.span color={"primary.500"}>Plattform</chakra.span>{" "}
              auswählen!
            </Text>
            <ButtonGroup w={"100%"} gap={4}>
              <Button
                w={"100%"}
                backgroundColor={"black"}
                size={"lg"}
                _hover={{ backgroundColor: "black" }}
                _active={{ backgroundColor: "black" }}
                as={Link}
                href={"/download"}
                fontSize={"xl"}
                leftIcon={<FaApple />}
                isDisabled
              >
                iOS
              </Button>
              <Button
                w={"100%"}
                backgroundColor={"black"}
                size={"lg"}
                _hover={{ backgroundColor: "black" }}
                _active={{ backgroundColor: "black" }}
                as={"a"}
                href={"https://app.saveworld.one"}
                target={"_blank"}
                fontSize={"xl"}
                leftIcon={<FaGlobe />}
              >
                Web
              </Button>
            </ButtonGroup>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
