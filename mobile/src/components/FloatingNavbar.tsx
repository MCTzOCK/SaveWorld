/**
 * mobile/src/components/FloatingNavbar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.11.2023
 *
 */

import * as React from "react";
import { Box, Grid, IconButton, Link } from "@chakra-ui/react";
import { BiHome } from "react-icons/bi";
import { FaHome, FaProjectDiagram } from "react-icons/fa";
import { FaLeaf, FaVideo } from "react-icons/fa6";

export default function FloatingNavbar() {
  return (
    <>
      <Box
        position={"fixed"}
        bottom={"5%"}
        left={"5%"}
        width={"60%"}
        maxWidth={"300px"}
        rounded={"xl"}
        bgColor={"rgba(0,0,0,1)"}
        opacity={[0.6, 0.3]}
        _hover={{
          opacity: 1,
        }}
        transition={"opacity 0.2s ease-in-out"}
        p={3}
        borderColor={"brand.500"}
        borderWidth={2}
        borderStyle={"solid"}
      >
        <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
          <IconButton
            aria-label={"Home"}
            icon={<FaHome />}
            variant={"ghost"}
            as={Link}
            href={"/onboarding"}
          />
          <IconButton
            aria-label={"Tracker"}
            icon={<FaLeaf />}
            variant={"ghost"}
            as={Link}
            href={"/e2"}
          />
          <IconButton
            aria-label={"Videos"}
            icon={<FaVideo />}
            variant={"ghost"}
            as={Link}
            href={"/learn"}
          />
          <IconButton
            aria-label={"Projekte"}
            icon={<FaProjectDiagram />}
            variant={"ghost"}
            as={Link}
            href={"/e2-projects/my"}
          />
        </Grid>
      </Box>
    </>
  );
}
