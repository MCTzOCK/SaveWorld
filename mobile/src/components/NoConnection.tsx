/**
 * mobile/src/components/NoConnection.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.01.2024
 *
 */

import * as React from "react";
import { theme } from "../theme/chakra";
import { ChakraProvider, Flex, Heading, Text } from "@chakra-ui/react";
import { __ } from "../translations/i18n";

export default function NoConnection() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Flex
          w={"100%"}
          h={"100vh"}
          alignItems={"center"}
          justifyContent={"center"}
          padding={6}
          direction={"column"}
        >
          <Heading>{__("page.offline.title")}</Heading>
          <Text>{__("page.offline.description")}</Text>
        </Flex>
      </ChakraProvider>
    </>
  );
}
