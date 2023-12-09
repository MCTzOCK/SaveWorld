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
import { Heading } from "@chakra-ui/react";
import AdminTools from "../../components/AdminTools";
import { IonSearchbar } from "@ionic/react";

export default function AdminDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [query, setQuery] = React.useState<string>("");

  return (
    <>
      <Page title={"Admin"} redGradient>
        <MobileBox bg={"#101010"}>
          <IonSearchbar
            placeholder={"Suchen"}
            value={query}
            onIonInput={(e) => {
              setQuery(e.detail.value!!);
            }}
            style={{
              padding: 0,
            }}
          />
          <AdminStats query={query} />
          <AdminTools query={query} />
          <AdminInternTools query={query} />
        </MobileBox>
      </Page>
    </>
  );
}
