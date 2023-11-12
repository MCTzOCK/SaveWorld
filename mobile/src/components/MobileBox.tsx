/**
 * mobile/src/components/MobileBox.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";

export default function MobileBox(props: {
  children: React.ReactNode;
  padding?: string;
}) {
  return (
    <>
      <Flex
        w={"100%"}
        justifyContent={["flex-start", "center"]}
        alignItems={["flex-start", "center"]}
        minH={"100vh"}
      >
        <Box
          backgroundColor={"rgba(10,10,10,0.5)"}
          borderRadius={"12px"}
          border={"4px solid rgba(40,40,40,1)"}
          w={["100%", "75%", "50%"]}
          minW={"200px"}
          p={props.padding || "2"}
        >
          {props.children}
        </Box>
      </Flex>
    </>
  );
}
