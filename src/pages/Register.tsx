/**
 * /Register.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonInput,
  IonItem,
  IonList,
  useIonRouter,
} from "@ionic/react";
import { REST } from "@saveworld/api-js";
import Page from "../components/Page";

export default function Register() {
  const router = useIonRouter();
  return (
    <>
      <Page title={"Willkommen"}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const mail = (e.target as any).mail.value;
            const user = (e.target as any).user.value;
            const firstName = (e.target as any).firstName.value;
            const lastName = (e.target as any).lastName.value;
            const pass = (e.target as any).pass.value;
            const passConf = (e.target as any).passConf.value;

            if (
              !mail ||
              !user ||
              !firstName ||
              !lastName ||
              !pass ||
              !passConf
            ) {
              alert("Bitte fülle alle Felder aus!");
              return;
            }

            if (pass !== passConf) {
              alert("Passwörter stimmen nicht überein!");
              return;
            }

            const res = await REST.Account.register({
              mail: mail,
              firstName: firstName,
              lastName: lastName,
              password: pass,
              username: user,
            });

            if (res.status === 200) {
              alert(
                "Registrierung erfolgreich! Bitte bestätige deine E-Mail Adresse.",
              );
              router.push("/login", "none", "replace");
            } else {
              alert("Registrierung fehlgeschlagen: " + res.payload.error);
            }
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              gap: "1.2rem",
            }}
          >
            <IonInput
              name={"user"}
              placeholder={"Benutzername"}
              style={{
                borderBottom: "1px solid var(--ion-color-success-shade)",
              }}
            />
            <IonInput
              name={"mail"}
              type={"email"}
              placeholder={"E-Mail"}
              style={{
                borderBottom: "1px solid var(--ion-color-success-shade)",
              }}
            />
          </div>
          <div
            style={{
              marginTop: "1.2rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              gap: "1.2rem",
            }}
          >
            <IonInput
              name={"firstName"}
              placeholder={"Vorname"}
              style={{
                borderBottom: "1px solid var(--ion-color-success-shade)",
              }}
            />
            <IonInput
              name={"lastName"}
              placeholder={"Nachname"}
              style={{
                borderBottom: "1px solid var(--ion-color-success-shade)",
              }}
            />
          </div>
          <div
            style={{
              marginTop: "1.2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              gap: "1.2rem",
            }}
          >
            <IonInput
              name={"pass"}
              type={"password"}
              placeholder={"Passwort"}
              style={{
                borderBottom: "1px solid var(--ion-color-success-shade)",
              }}
            />
            <IonInput
              name={"passConf"}
              type={"password"}
              placeholder={"Passwort bestätigen"}
              style={{
                borderBottom: "1px solid var(--ion-color-success-shade)",
              }}
            />
          </div>
          <IonButton
            type={"submit"}
            style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}
            expand={"block"}
            color={"success"}
          >
            Registrieren
          </IonButton>

          <IonList inset>
            <IonItem
              color={"light"}
              routerLink={"/login"}
              routerDirection={"none"}
            >
              Stattdessen anmelden
            </IonItem>
          </IonList>
        </form>
      </Page>
    </>
  );
}
