/**
 * website/src/components/presentation/Slide.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.02.2024
 *
 */

import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";

export default function Slide(props: {
  children: React.ReactNode;
  layout?: SlideLayout;
}) {
  if (props.layout === SlideLayout.CENTER) {
    return (
      <Flex
        w={"100%"}
        h={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
        p={10}
      >
        {props.children}
      </Flex>
    );
  }

  if (props.layout === SlideLayout.TITLE) {
    return (
      <Flex
        w={"100%"}
        h={"100vh"}
        p={10}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        {props.children}
      </Flex>
    );
  }

  if (props.layout === SlideLayout.SIDEBYSIDE) {
    return (
      <Flex
        w={"100%"}
        h={"100vh"}
        p={10}
        justifyContent={"center"}
        flexDirection={"row"}
        gap={10}
      >
        {props.children}
      </Flex>
    );
  }

  return <Box p={10}>{props.children}</Box>;
}
export enum SlideLayout {
  CENTER,
  TITLE,
  SIDEBYSIDE,
}
