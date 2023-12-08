/**
 * /AdminDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import MobileBox from "../../components/MobileBox";
import AdminStats from "../../components/AdminStats";
import AdminInternTools from "../../components/AdminInternTools";

export default function AdminDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  return (
    <>
      <Page title={"Admin"} redGradient>
        <MobileBox bg={"#101010"}>
          <AdminStats />
          <AdminInternTools />
        </MobileBox>
      </Page>
    </>
  );
}
