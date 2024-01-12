/**
 * mobile/src/components/HomeCardV2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.11.2023
 *
 */

import * as React from "react";
import { ReactNode } from "react";
import {
  BackgroundProps,
  Box,
  chakra,
  Flex,
  Heading,
  Link,
} from "@chakra-ui/react";
import { useIonRouter } from "@ionic/react";

export default function HomeCardV2(props: {
  icon: ReactNode;
  text: string;
  url: string;
  color: BackgroundProps["bgColor"];
  newTab?: boolean;
}) {
  const router = useIonRouter();
  return (
    <>
      <Box
        bgColor={"gray.900"}
        p={5}
        w={"100%"}
        h={"100%"}
        rounded={"xl"}
        as={Link}
        href={props.url}
        target={props.newTab ? "_blank" : undefined}
        onClick={(e) => {
          e.preventDefault();
          router.push(props.url);
        }}
        shadow={"2xl"}
      >
        <Flex direction={"column"} w={"100%"} alignItems={"center"} zIndex={12}>
          <chakra.span color={props.color} fontSize={"6xl"}>
            {props.icon}
          </chakra.span>
          <Heading color={"white"} fontSize={"2xl"} fontWeight={1000}>
            {props.text}
          </Heading>
        </Flex>
      </Box>
    </>
  );
}
