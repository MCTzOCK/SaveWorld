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

export default function AdminContentDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  return (
    <>
      <Page title={"Inhalte"} redGradient>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
        >
          <IonCard color={"danger"} routerLink={"/admin/content/categories"}>
            <IonCardHeader>
              <IonCardTitle>Kategorien und Interessen</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                Hier kannst du Kategorien und Interessen verwalten.
              </IonText>
            </IonCardContent>
          </IonCard>
          <IonCard color={"danger"} routerLink={"/admin/content/videos"}>
            <IonCardHeader>
              <IonCardTitle>Videos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>Hier kannst du Videos verwalten.</IonText>
            </IonCardContent>
          </IonCard>
        </Grid>
      </Page>
    </>
  );
}
