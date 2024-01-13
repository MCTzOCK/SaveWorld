/**
 * mobile/src/pages/account/Licenses.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.01.2024
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import MobileBox from "../../components/MobileBox";
import { Text } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Licenses() {
  const [licenses, setLicenses] = React.useState<string>("");

  useEffect(() => {
    fetch("/licenses.txt").then((res) => {
      res.text().then((text) => {
        setLicenses(text);
      });
    });
  }, []);

  return (
    <>
      <Page title={"Lizensen"}>
        <MobileBox>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              fontFamily: "monospace",
              lineHeight: "1.5",
            }}
          >
            {licenses}
          </pre>
        </MobileBox>
      </Page>
    </>
  );
}
