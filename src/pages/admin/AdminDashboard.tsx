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
import { useEffect, useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { REST } from "@saveworld/api-js";

export default function AdminDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [stats, setStats] = useState<{
    users: {
      count: number;
      inLastWeek: number;
      active: number;
    };
  }>({
    users: {
      count: 0,
      inLastWeek: 0,
      active: 0,
    },
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    REST.Admin.stats(localStorage.getItem("token") as string).then((res) => {
      if (res.status === 200) {
        setStats(res.payload.stats);
      } else {
        alert("Fehler beim Laden der Statistiken: " + res.payload.error);
      }
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Page title={"Admin"} redGradient>
        {loading && (
          <>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "50vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonSpinner />
            </div>
          </>
        )}
        {!loading && (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Willkommen</IonCardTitle>
                <IonCardSubtitle>Angepinnt - Admin Dashboard</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  Mit dem Admin Dashboard kannst du die Nutzer verwalten und
                  Statistiken einsehen. Doch Vorsicht: Mit großer Macht kommt
                  große Verantwortung!
                </IonText>
              </IonCardContent>
            </IonCard>
            <IonCard color={"primary"} routerLink={"/admin/users"}>
              <IonCardHeader>
                <IonCardTitle>Benutzer</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  Aktuell sind <b>{stats.users.count}</b> Benutzer registriert.
                  Davon haben sich <b>{stats.users.inLastWeek}</b> in den
                  letzten 7 Tagen registriert. <b>{stats.users.active}</b>&nbsp;
                  Benutzerkonten sind aktiviert.
                </IonText>
              </IonCardContent>
            </IonCard>
            <IonCard color={"primary"} routerLink={"/admin/content"}>
              <IonCardHeader>
                <IonCardTitle>Inhalte</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  Verwalte die Inhalte der App. Du kannst hier neue Inhalte
                  erstellen, bearbeiten und löschen.
                </IonText>
              </IonCardContent>
            </IonCard>
          </>
        )}
      </Page>
    </>
  );
}
