/**
 * mobile/src/components/E2FindProjectsMap.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2023
 *
 */

import * as React from "react";
import { Map, Marker } from "mapkit-react";
import { APPLE_MAP_KIT_TOKEN } from "../env";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { E2Projects } from "../util/types/E2Project";
import { REST } from "@saveworld/api-js";

export default function E2FindProjectsMap() {
  const [projects, setProjects] = useState<E2Projects>([]);

  return (
    <>
      <Box
        style={{
          width: "100%",
          height: "80vh",
        }}
      >
        <Map token={APPLE_MAP_KIT_TOKEN} showsCompass={0}></Map>
      </Box>
    </>
  );
}
