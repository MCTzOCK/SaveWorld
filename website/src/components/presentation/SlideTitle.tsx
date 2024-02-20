/**
 * website/src/components/presentation/SlideTitle.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.02.2024
 *
 */

import { Box, Heading } from "@chakra-ui/react";
import React from "react";

export default function SlideTitle({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: boolean;
}) {
  if (sub) {
    return (
      <Box mb={4}>
        <Heading as={"h1"} fontSize={"4xl"} color={"white"} mt={8}>
          {children}
        </Heading>
      </Box>
    );
  }
  return (
    <Box mb={4}>
      <Heading
        as={"h1"}
        fontSize={"8xl"}
        color={"primary.500"}
        fontWeight={"1000"}
      >
        {children}
      </Heading>
    </Box>
  );
}
