/**
 * packages/components/global/DividerWithText.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.10.22
 * Original-Project: CodeUp © Ben Siebert 2022-2024
 *
 */

import { Divider, Flex, Text } from "@chakra-ui/react";
import * as React from "react";

export default function DividerWithText(props: {
  text?: string;
  color?: string;
}) {
  return (
    <>
      <Flex align="center">
        <Divider />
        <Text
          padding="2"
          color={props.color ? props.color : "gray.500"}
          fontWeight={700}
        >
          {props.text ? props.text.toUpperCase() : "ODER"}
        </Text>
        <Divider />
      </Flex>
    </>
  );
}
