/**
 * /AdminUserDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useParams } from "react-router";
import Page from "../../components/Page";
import { REST } from "../../REST";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonToggle,
} from "@ionic/react";
import { warning, warningSharp } from "ionicons/icons";

export default function AdminUserDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [user, setUser] = useState<{
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    password: string;
    updatedAt: string;
    totpSecret: string;
    active: boolean;
    admin: boolean;
    activationToken: string;
  }>({
    id: "",
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    createdAt: "",
    password: "",
    updatedAt: "",
    totpSecret: "",
    active: false,
    admin: false,
    activationToken: "",
  });

  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    if (id) {
      REST.Admin.users(localStorage.getItem("token") as string, id).then(
        (res) => {
          if (res.status === 200) {
            setUser(res.payload.users[0]);
          } else {
            alert("Fehler beim Laden des Benutzers: " + res.payload.error);
          }
          setLoading(false);
        },
      );
    }
  }, [id]);

  return (
    <>
      <Page title={user.username} redGradient>
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
                <IonCardTitle>Einstellungen</IonCardTitle>
                <IonCardSubtitle>
                  {user.firstName} {user.lastName}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const mail = (e.target as any).mail.value;
                    const firstName = (e.target as any).firstName.value;
                    const lastName = (e.target as any).lastName.value;
                    const password = (e.target as any).password.value;
                    const active = (
                      document.getElementById(
                        "admin_change_user_settings_active",
                      ) as HTMLIonToggleElement
                    ).checked;
                    const admin = (
                      document.getElementById(
                        "admin_change_user_settings_admin",
                      ) as HTMLIonToggleElement
                    ).checked;

                    const res = await REST.Admin.updateUser(
                      localStorage.getItem("token") as string,
                      id,
                      {
                        email: mail,
                        firstName: firstName,
                        lastName: lastName,
                        password: password,
                        active: active,
                        admin: admin,
                      },
                    );

                    if (res.status === 200) {
                      alert("Erfolgreich gespeichert!");
                      window.location.reload();
                    } else {
                      alert("Fehler beim speichern: " + res.payload.error);
                    }
                  }}
                >
                  <IonList
                    inset
                    style={{
                      margin: 0,
                    }}
                  >
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={"Benutzername"}
                        disabled
                        value={user.username}
                      />
                    </IonItem>
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={"E-Mail"}
                        value={user.email}
                        name={"mail"}
                      />
                    </IonItem>
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={"Vorname"}
                        value={user.firstName}
                        name={"firstName"}
                      />
                    </IonItem>
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={"Nachname"}
                        value={user.lastName}
                        name={"lastName"}
                      />
                    </IonItem>
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={"Passwort"}
                        value={""}
                        type={"password"}
                        name={"password"}
                      />
                    </IonItem>
                    <IonItem color={"light"}>
                      <IonToggle
                        labelPlacement={"fixed"}
                        id={"admin_change_user_settings_active"}
                        checked={user.active}
                      >
                        <IonLabel>Aktiv</IonLabel>
                      </IonToggle>
                    </IonItem>
                    <IonItem color={"light"}>
                      <IonIcon
                        slot={"start"}
                        ios={warning}
                        md={warningSharp}
                        color={"danger"}
                      />
                      <IonToggle
                        labelPlacement={"fixed"}
                        id={"admin_change_user_settings_admin"}
                        checked={user.admin}
                      >
                        <IonLabel color={"danger"}>Admin</IonLabel>
                      </IonToggle>
                    </IonItem>
                  </IonList>
                  <IonButton
                    type={"submit"}
                    expand={"block"}
                    style={{
                      marginTop: "1.2rem",
                    }}
                  >
                    Speichern
                  </IonButton>
                </form>
              </IonCardContent>
            </IonCard>
          </>
        )}
      </Page>
    </>
  );
}
