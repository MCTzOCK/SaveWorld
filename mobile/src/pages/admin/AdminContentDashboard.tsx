/**
 * mobile/src/pages/admin/AdminContentDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.08.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js/index";
import { Grid } from "@chakra-ui/react";
import { $$ } from "../../translations/i18n";

export default function AdminContentDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  return (
    <>
      <Page title={$$("menu.contents")} redGradient>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
        >
          <IonCard color={"danger"} routerLink={"/admin/content/categories"}>
            <IonCardHeader>
              <IonCardTitle>
                {$$("pages.admin.content.categories.and.interests")}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                {$$("pages.admin.content.categories.and.interests.description")}
              </IonText>
            </IonCardContent>
          </IonCard>
          <IonCard color={"danger"} routerLink={"/admin/content/videos"}>
            <IonCardHeader>
              <IonCardTitle>{$$("menu.videos")}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>{$$("pages.admin.content.videos.description")}</IonText>
            </IonCardContent>
          </IonCard>
        </Grid>
      </Page>
    </>
  );
}
