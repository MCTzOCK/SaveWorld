/**
 * /AdminUsersDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { useState } from "react";
import { reloadCircle, reloadCircleSharp } from "ionicons/icons";
import { REST } from "@saveworld/api-js";

export default function AdminUsersDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [users, setUsers] = useState<
    {
      _id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      createdAt: string;
      password: string;
      updatedAt: string;
      totpSecret: string;
      active: boolean;
      role: string;
      activationToken: string;
    }[]
  >([]);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  React.useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    const res = await REST.Admin.users(localStorage.getItem("token") as string);
    if (res.status === 200) {
      setUsers(res.payload.users);
    } else {
      alert("Fehler beim Laden der Benutzer: " + res.payload.error);
    }
    setLoading(false);
  };

  return (
    <>
      <Page title={"Benutzer"} redGradient>
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
            <IonRefresher
              slot={"fixed"}
              onIonRefresh={async (ev) => {
                await reload();
                ev.detail.complete();
              }}
            >
              <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            <IonSearchbar
              placeholder={"Durchsuchen"}
              value={query}
              onIonInput={(e) => {
                setQuery((e.target as any).value);
              }}
            />
            {users
              .filter((user) => {
                if (query === "") {
                  return true;
                }
                return (
                  user.username.toLowerCase().includes(query.toLowerCase()) ||
                  user.email.toLowerCase().includes(query.toLowerCase()) ||
                  user.firstName.toLowerCase().includes(query.toLowerCase()) ||
                  user.lastName.toLowerCase().includes(query.toLowerCase())
                );
              })
              .map((user) => {
                return (
                  <>
                    <IonCard routerLink={"/admin/users/" + user._id}>
                      <IonCardHeader>
                        <IonCardTitle>
                          {user.firstName} {user.lastName}
                        </IonCardTitle>
                        <IonCardSubtitle>
                          <IonText
                            color={user.role === "admin" ? "danger" : ""}
                          >
                            {user.role === "admin"
                              ? "Administrator"
                              : "Benutzer"}
                          </IonText>
                          &nbsp;-&nbsp;
                          <IonText color={user.active ? "success" : "danger"}>
                            {user.active ? "Aktiv" : "Inaktiv"}
                          </IonText>
                        </IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonText>
                          {user.username} - {user.email}
                        </IonText>
                        <br />
                        <IonText>
                          2FA:&nbsp;
                          <IonText
                            color={!user.totpSecret ? "danger" : "success"}
                          >
                            {!user.totpSecret ? "Deaktiviert" : "Aktiviert"}
                          </IonText>
                        </IonText>
                        <br />
                        <IonText>
                          Erstellt am:&nbsp;
                          {new Date(user.createdAt).toLocaleString()}
                        </IonText>
                      </IonCardContent>
                    </IonCard>
                  </>
                );
              })}
          </>
        )}
      </Page>
    </>
  );
}
