/**
 * mobile/src/components/SustainabilityExplanation.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 18.03.2024
 *
 */

import * as React from "react";
import { Flex, Image } from "@chakra-ui/react";
import { $$ } from "../translations/i18n";

export default function SustainabilityExplanation(props: {
  noImage?: boolean;
}) {
  return (
    <>
      <Flex
        justifyContent={"center"}
        direction={"column"}
        w={"100%"}
        alignItems={"center"}
        display={props.noImage ? "none" : "flex"}
      >
        <Image
          src={"/assets/sustainability/sustainability_triangle.svg"}
          maxW={["75%", "75%", "50%", "50%"]}
          rounded={"xl"}
        />
      </Flex>
      {$$("pages.sustainability.section.1")}
      <br />
      {$$("pages.sustainability.section.2")}
      <br />
      {$$("pages.sustainability.section.3")}
    </>
  );
}
