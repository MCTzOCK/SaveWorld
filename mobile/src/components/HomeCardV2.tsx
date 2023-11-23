/**
 * mobile/src/components/HomeCardV2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import * as React from "react";
import { ReactNode } from "react";
import { IonCard, IonCardContent } from "@ionic/react";
import {
  BackgroundProps,
  Box,
  chakra,
  Flex,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { FaLeaf } from "react-icons/fa6";

export default function HomeCardV2(props: {
  icon: ReactNode;
  text: string;
  url: string;
  color: BackgroundProps["bgColor"];
}) {
  return (
    <>
      <Box
        bgColor={props.color}
        p={6}
        w={"100%"}
        h={"100%"}
        rounded={"md"}
        as={Link}
        href={props.url}
      >
        <Flex direction={"column"} w={"100%"} alignItems={"center"}>
          <chakra.span fontSize={"6xl"}>{props.icon}</chakra.span>
          <Heading color={"white"} fontSize={"2xl"}>
            {props.text}
          </Heading>
        </Flex>
      </Box>
    </>
  );
}
