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
import { useIonRouter } from "@ionic/react";
import { $$ } from "../translations/i18n";

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
            {$$("product.name")}
          </Heading>
          <Text fontSize={["2xl", "4xl"]} fontWeight={700}>
            {$$("pages.home.anon.title.1")}{" "}
            <chakra.span color={"brand.500"} fontWeight={900}>
              {$$("pages.home.anon.title.2")}
            </chakra.span>
            {$$("pages.home.anon.title.3")}
          </Text>
          <Text fontSize={["2xl", "4xl"]} fontWeight={700}>
            {$$("pages.home.anon.title.4")}{" "}
            <chakra.span color={"brand.500"} fontWeight={900}>
              {$$("pages.home.anon.title.5")}
            </chakra.span>
            {$$("pages.home.anon.title.6")}
          </Text>
          <ButtonGroup w={"100%"} justifyContent={["center", "right"]}>
            <Button
              size={"lg"}
              variant={"brand"}
              _hover={{
                textDecoration: "none",
              }}
              as={Link}
              href={"/login"}
              onClick={(e) => {
                e.preventDefault();
                router.push("/login");
              }}
              fontSize={"xl"}
            >
              {$$("pages.home.anon.call.to.action")}
            </Button>
          </ButtonGroup>
        </Flex>
      </Flex>
    </Box>
  );
}
