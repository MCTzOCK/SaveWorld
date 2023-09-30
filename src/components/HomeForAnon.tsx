/**
 * mobile/src/components/HomeForAnon.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.10.2023
 *
 */

import * as React from "react";
import { Box, Button, chakra, Heading, Image, Text } from "@chakra-ui/react";
import HomeCard from "./HomeCard";
import { FaEarthEurope } from "react-icons/fa6";
import { IonCard, IonCardContent } from "@ionic/react";

export default function HomeForAnon() {
  return (
    <>
      <Image
        src={"/earth-destroyed.jpg"}
        width={["90%", "40%"]}
        style={{
          zIndex: -1,
          position: "absolute",
          filter: "blur(2px)",
          objectFit: "cover",
        }}
        top={["20%", "10%"]}
        maxHeight={["300px", "800px"]}
      />
      <Box mt={"10%"}></Box>
    </>
  );
}
