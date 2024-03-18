/**
 * mobile/src/pages/sustainability/Sustainability.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.11.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import MobileBox from "../../components/MobileBox";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useIonRouter } from "@ionic/react";
import { $$ } from "../../translations/i18n";
import SustainabilityExplanation from "../../components/SustainabilityExplanation";

export default function Sustainability() {
  const router = useIonRouter();

  return (
    <>
      <Page title={$$("page.sustainability.title")}>
        <MobileBox>
          <SustainabilityExplanation />
          <Button
            color={"brand.500"}
            w={"100%"}
            mt={4}
            onClick={() => {
              router.push("/sustainability/articles", "forward", "push");
            }}
          >
            {$$("pages.sustainability.call.to.action")}
          </Button>
        </MobileBox>
      </Page>
    </>
  );
}
