/**
 * mobile/src/pages/admin/adp/AdvancedDataPlatform.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.01.2024
 *
 */

import * as React from "react";
import Page from "../../../components/Page";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";
import { $$ } from "../../../translations/i18n";
import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import { useRedirectForAnon } from "../../../hooks/useRedirectForAnon";
import ADPSidebar from "../../../components/ADPSidebar";

export default function AdvancedDataPlatform() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const isMobile = useMediaQuery("(max-width: 800px)")[0];

  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  useEffect(() => {
    if (!localStorage) return;
    if (localStorage.getItem("sidebarCollapsed") === "true") {
      setSidebarCollapsed(true);
    }
  }, []);

  if (isMobile) {
    return (
      <Page title={$$("pages.admin.adp")}>
        {$$("pages.admin.adp.mobile.disclaimer")}
      </Page>
    );
  }

  return (
    <Page title={$$("pages.admin.adp")} noPadding>
      <Flex w={"100%"} h={"fit-content"} minH={"100vh"} bg={"black"} gap={4}>
        <ADPSidebar />
        <Box flex={"90%"}>123</Box>
      </Flex>
    </Page>
  );
}
