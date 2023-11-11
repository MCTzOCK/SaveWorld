/**
 * website/src/pages/paper.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import { Flex, Heading, Stack, Text } from "@chakra-ui/react";

export default function Paper() {
  return (
    <>
      <Flex align="center" justify="center" w={"100%"} minH={[0, "100vh"]}>
        <Stack
          spacing={8}
          w="100%"
          maxW="800px"
          p={8}
          bgColor={["transparent", "#000"]}
          rounded="lg"
          shadow={["none", "xl"]}
        >
          <Heading size={"2xl"} color={"primary.500"}>
            Schriftliche Arbeit
          </Heading>
          <Text fontSize={"lg"}>
            Zum aktuellen Zeitpunkt (11.11.2023) ist noch keine schriftliche
            Arbeit vorhanden. Diese wird spätestens ab dem 01.02.2024 hier zur
            Verfügung stehen.
          </Text>
        </Stack>
      </Flex>
    </>
  );
}
