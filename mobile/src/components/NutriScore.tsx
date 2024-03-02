/**
 * mobile/src/components/NutriScore.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.03.2024
 *
 */

import * as React from "react";
import { Box, HStack } from "@chakra-ui/react";

export default function NutriScore(props: { grade: string; score: number }) {
  const compare = (a: string, b: string) => {
    if (a === b) return true;
    if (a.toLowerCase() === b.toLowerCase()) return true;
    return false;
  };

  return (
    <>
      <HStack
        gap={0}
        w={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <NutriEntry
          text={"A"}
          color={"brand.500"}
          rStart
          big={compare(props.grade, "a")}
        />
        <NutriEntry
          text={"B"}
          color={"green.400"}
          big={compare(props.grade, "b")}
        />
        <NutriEntry
          text={"C"}
          color={"yellow.500"}
          big={compare(props.grade, "c")}
        />
        <NutriEntry
          text={"D"}
          color={"orange.500"}
          big={compare(props.grade, "d")}
        />
        <NutriEntry
          text={"E"}
          color={"red.500"}
          rEnd
          big={compare(props.grade, "e")}
        />
      </HStack>
    </>
  );
}

function NutriEntry(props: {
  big?: boolean;
  text: string;
  color: string;
  rEnd?: boolean;
  rStart?: boolean;
}) {
  return (
    <Box
      bg={props.color}
      color={"white"}
      p={2}
      borderRadius={
        props.big
          ? "5px"
          : props.rEnd
          ? "0 5px 5px 0"
          : props.rStart
          ? "5px 0 0 5px"
          : "0"
      }
      fontSize={props.big ? "2xl" : "md"}
      fontWeight={props.big ? 700 : "normal"}
    >
      {props.text}
    </Box>
  );
}
