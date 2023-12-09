/**
 * mobile/src/components/AdminStat.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.12.2023
 *
 */

import * as React from "react";
import {
  Box,
  chakra,
  Flex,
  Link,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { ReactNode } from "react";

export default function AdminStat(props: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
}) {
  return (
    <>
      <Box
        bgColor={"gray.900"}
        p={5}
        w={"100%"}
        h={"100%"}
        rounded={"xl"}
        shadow={"2xl"}
      >
        <Flex
          direction={"row"}
          w={"100%"}
          alignItems={"center"}
          zIndex={12}
          justifyContent={"space-between"}
        >
          <chakra.span fontSize={"6xl"} w={"50%"}>
            {props.icon}
          </chakra.span>
          <Stat>
            <StatLabel fontSize={"lg"}>{props.title}</StatLabel>
            <StatNumber color={"red.500"}>{props.value}</StatNumber>
            <StatHelpText>{props.subtitle}</StatHelpText>
          </Stat>
        </Flex>
      </Box>
    </>
  );
}
