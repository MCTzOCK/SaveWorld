/**
 * mobile/src/components/AdminTools.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.12.2023
 *
 */

import * as React from "react";
import { Grid, Heading } from "@chakra-ui/react";
import HomeCardV2 from "./HomeCardV2";
import { FaUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

export default function AdminTools(props: { query: string }) {
  return (
    <>
      <Heading size={"lg"} mb={4} color={"red.500"}>
        Administration
      </Heading>
      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ]}
        gap={4}
      >
        <HomeCardV2
          icon={<FaUsers />}
          text={"Benutzer"}
          url={"/admin/users"}
          color={"red.500"}
        />
      </Grid>
    </>
  );
}
