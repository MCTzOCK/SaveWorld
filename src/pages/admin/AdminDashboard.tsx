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
  IonItem,
  IonList,
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
            <IonCard color={"danger"} routerLink={"/admin/users"}>
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
            <IonCard color={"danger"} routerLink={"/admin/content"}>
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
            <IonCard color={"danger"} routerLink={"/admin/lifestyle-templates"}>
              <IonCardHeader>
                <IonCardTitle>Lifestyle Vorlagen</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  Verwalte die Vorlagen für die Eingabe des Lifestyles eines
                  Benutzers.
                </IonText>
              </IonCardContent>
            </IonCard>
            <IonList inset>Interne Werkzeuge:</IonList>
            <IonList inset>
              <IonItem
                color={"light"}
                href={"https://s3.ben-siebert.com"}
                target={"_blank"}
              >
                S3-Admin
              </IonItem>
              <IonItem
                color={"light"}
                href={"https://portainer.cluster.ben-siebert.com"}
                target={"_blank"}
              >
                Docker-Admin
              </IonItem>
              <IonItem
                color={"light"}
                href={"https://http.cluster.ben-siebert.com"}
                target={"_blank"}
              >
                Reverse Proxy
              </IonItem>
              <IonItem
                color={"light"}
                href={"https://saveworld.one/wp-admin"}
                target={"_blank"}
              >
                Website-Admin
              </IonItem>
              <IonItem
                color={"light"}
                href={"https://status.saveworld.one"}
                target={"_blank"}
              >
                Server Status
              </IonItem>
              <IonItem
                color={"light"}
                href={
                  "https://dashboard.onesignal.com/apps/7575751a-432d-44b0-baa2-84dcfc925f45"
                }
                target={"_blank"}
              >
                OneSignal (Push)
              </IonItem>
            </IonList>
          </>
        )}
      </Page>
    </>
  );
}
