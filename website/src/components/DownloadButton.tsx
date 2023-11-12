/**
 * website/src/components/DownloadButton.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import { Button } from "@chakra-ui/react";
import Link from "next/link";

export default function DownloadButton() {
  return (
    <>
      <Button
        backgroundColor={"primary.600"}
        _hover={{ backgroundColor: "primary.500" }}
        _active={{ backgroundColor: "primary.700" }}
        as={Link}
        href={"/download"}
        fontSize={"xl"}
        size={"lg"}
        mt={2}
      >
        App herunterladen
      </Button>
    </>
  );
}
