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
import { REST } from "@saveworld/api-js";
import { Grid } from "@chakra-ui/react";
import { __ } from "../../translations/i18n";

export default function AdminContentDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  return (
    <>
      <Page title={__("menu.contents")} redGradient>
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
                {__("pages.admin.content.categories.and.interests")}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                {__("pages.admin.content.categories.and.interests.description")}
              </IonText>
            </IonCardContent>
          </IonCard>
          <IonCard color={"danger"} routerLink={"/admin/content/videos"}>
            <IonCardHeader>
              <IonCardTitle>{__("menu.videos")}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>{__("pages.admin.content.videos.description")}</IonText>
            </IonCardContent>
          </IonCard>
        </Grid>
      </Page>
    </>
  );
}
