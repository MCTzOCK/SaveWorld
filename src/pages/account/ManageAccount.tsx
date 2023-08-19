/**
 * /ManageAccount.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useUserData } from "../../hooks/useUserData";
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  IonSpinner,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { REST } from "../../REST";

export default function ManageAccount() {
  const { loggedIn, loaded, userInfo } = useUserData();

  useRedirectForAnon();

  const router = useIonRouter();

  return (
    <>
      <Page title={"Konto"}>
        {!loaded && (
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
        {loaded && (
          <>
            <IonList inset>
              <IonText>Konto-Informationen</IonText>
            </IonList>
            <IonList inset>
              <IonItem color={"light"}>
                <IonInput
                  labelPlacement={"fixed"}
                  label={"Benutzername"}
                  value={userInfo.username}
                  disabled={true}
                />
              </IonItem>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const mail = (e.target as any).mail.value;
                  const firstName = (e.target as any).firstName.value;
                  const lastName = (e.target as any).lastName.value;

                  const res = await REST.Account.update(
                    localStorage.getItem("token") as string,
                    {
                      mail: mail,
                      firstName: firstName,
                      lastName: lastName,
                    },
                  );

                  if (res.status === 200) {
                    alert("Erfolgreich gespeichert!");
                    window.location.reload();
                  } else {
                    alert("Fehler beim speichern: " + res.payload.error);
                  }
                }}
                id={"acc_updateInfoForm"}
              >
                <IonItem color={"light"}>
                  <IonInput
                    labelPlacement={"fixed"}
                    label={"E-Mail"}
                    type={"email"}
                    value={userInfo.email}
                    name={"mail"}
                  />
                </IonItem>
                <IonItem color={"light"}>
                  <IonInput
                    labelPlacement={"fixed"}
                    label={"Vorname"}
                    value={userInfo.firstName}
                    name={"firstName"}
                  />
                </IonItem>
                <IonItem color={"light"}>
                  <IonInput
                    labelPlacement={"fixed"}
                    label={"Nachname"}
                    value={userInfo.lastName}
                    name={"lastName"}
                  />
                </IonItem>
                <IonItem color={"light"}>
                  <IonButton
                    type={"submit"}
                    fill={"clear"}
                    style={{
                      padding: 0,
                      margin: 0,
                    }}
                    expand={"full"}
                  >
                    Speichern
                  </IonButton>
                </IonItem>
              </form>
            </IonList>
            <IonList inset>
              <IonText>Passwort ändern</IonText>
            </IonList>
            <IonList inset>
              <IonItem color={"light"}>
                <IonInput
                  labelPlacement={"fixed"}
                  label={"Neues Passwort"}
                  type={"password"}
                  id={"acc_change_pass"}
                />
              </IonItem>
              <IonItem color={"light"}>
                <IonInput
                  labelPlacement={"fixed"}
                  label={"Bestätigen"}
                  type={"password"}
                  id={"acc_change_pass_conf"}
                />
              </IonItem>
              <IonItem
                color={"light"}
                onClick={async () => {
                  const pass = (
                    document.getElementById("acc_change_pass") as any
                  ).value;
                  const passConf = (
                    document.getElementById("acc_change_pass_conf") as any
                  ).value;

                  if (pass !== passConf || pass === "" || passConf === "") {
                    alert("Passwörter stimmen nicht überein!");
                    return;
                  }

                  const res = await REST.Account.update(
                    localStorage.getItem("token") as string,
                    {
                      password: pass,
                    },
                  );

                  if (res.status === 200) {
                    alert("Erfolgreich gespeichert!");
                    window.location.reload();
                  } else {
                    alert("Fehler beim Speichern: " + res.payload.error);
                  }
                }}
              >
                <IonText color={"primary"}>Speichern</IonText>
              </IonItem>
            </IonList>
            <IonList inset>
              <IonText>Destruktive Aktionen</IonText>
            </IonList>
            <IonList inset>
              <IonItem
                color={"light"}
                detail
                onClick={() => {
                  if (
                    !confirm("Bist du sicher, dass du dich abmelden möchtest?")
                  )
                    return;
                  localStorage.removeItem("token");
                  window.location.assign("/register");
                }}
              >
                <IonText color={"danger"}>Abmelden</IonText>
              </IonItem>
              <IonItem
                color={"light"}
                detail
                onClick={async () => {
                  if (
                    !confirm(
                      "Bist du sicher, dass du dein Konto löschen möchtest?",
                    )
                  )
                    return;

                  const res = await REST.Account.delete(
                    localStorage.getItem("token") as string,
                  );

                  if (res.status === 200) {
                    localStorage.removeItem("token");
                    window.location.assign("/register");
                  } else {
                    alert(
                      "Fehler beim Löschen, bitte kontaktiere den Support: " +
                        res.payload.error,
                    );
                  }
                }}
              >
                <IonText color={"danger"}>Konto löschen</IonText>
              </IonItem>
            </IonList>
          </>
        )}
      </Page>
    </>
  );
}
