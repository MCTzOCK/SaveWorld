/**
 * website/src/components/presentation/SlideList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.02.2024
 *
 */

import * as React from "react";
import { Stack } from "@chakra-ui/react";
import SlideTitle from "@/components/presentation/SlideTitle";

export default function SlideList(props: { lines: string[] }) {
  return (
    <>
      <Stack gap={2} flex={"100%"}>
        {props.lines.map((c) => {
          return <SlideTitle sub>&bull;&nbsp;{c}</SlideTitle>;
        })}
      </Stack>
    </>
  );
}
