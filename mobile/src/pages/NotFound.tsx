/**
 * mobile/src/pages/NotFound.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.08.2023
 *
 */

import * as React from "react";
import Page from "../components/Page";
import { IonButton, useIonRouter } from "@ionic/react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { $$ } from "../translations/i18n";

export default function NotFound() {
  const router = useIonRouter();

  return (
    <Page title={""}>
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box maxW={["100%", "40%"]}>
          <Heading
            fontSize={["6xl", "8xl"]}
            textAlign={"center"}
            fontWeight={1000}
            style={{
              fontFamily: "Inter, sans-serif",
            }}
            maxWidth={"100%"}
            color={"brand.500"}
          >
            404
          </Heading>
          <Text
            style={{
              fontFamily: "Inter, sans-serif",
            }}
            padding={"1rem"}
            fontSize={"xl"}
          >
            {$$("page.404.description")}
          </Text>
          <Flex
            flexDirection={["column", "row"]}
            w={"100%"}
            gap={"2"}
            alignItems={"center"}
          >
            <Button
              w={"100%"}
              color={"brand.500"}
              as={Link}
              href={"/support"}
              onClick={(e) => {
                e.preventDefault();
                router.push("/support");
              }}
            >
              {$$("menu.support")}
            </Button>
            <Button
              w={"100%"}
              color={"brand.500"}
              as={Link}
              href={"/"}
              onClick={(e) => {
                e.preventDefault();
                router.push("/");
              }}
            >
              {$$("page.404.home")}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Page>
  );
}
