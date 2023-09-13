/**
 * /Login.tsx
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
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { REST } from "@saveworld/api-js";
import Page from "../components/Page";

export default function Login() {
  const router = useIonRouter();
  return (
    <>
      <Page title={"Anmelden"}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const mail = (e.target as any).mail.value;
            const pass = (e.target as any).pass.value;

            const res = await REST.Account.login(mail, pass);

            if (res.status === 200) {
              localStorage.setItem("token", res.payload.token);
              const prefs = await REST.Account.preferences(res.payload.token);

              let hasInterests = false;

              if (!prefs.payload.prefs.interests) {
                hasInterests = false;
              } else {
                hasInterests = prefs.payload.prefs.interests.length > 0;
              }

              if (!hasInterests) {
                router.push("/welcome", "none", "replace");
              } else {
                router.push("/onboarding", "none", "replace");
              }
            } else {
              if (res.payload.error === "TOTP Code incorrect") {
                const code = prompt("Bitte gebe den 2FA Code ein");

                if (!code) return;
                const resp = await REST.Account.login(mail, pass, code);

                if (resp.status === 200) {
                  localStorage.setItem("token", resp.payload.token);
                  const prefs = await REST.Account.preferences(
                    resp.payload.token,
                  );
                  let hasInterests = false;

                  if (!prefs.payload.prefs.interests) {
                    hasInterests = false;
                  } else {
                    hasInterests = prefs.payload.prefs.interests.length > 0;
                  }

                  if (!hasInterests) {
                    router.push("/welcome", "none", "replace");
                  } else {
                    router.push("/onboarding", "none", "replace");
                  }
                } else {
                  alert("Fehler beim anmelden: " + resp.payload.error);
                }
              } else {
                alert("Fehler beim anmelden: " + res.payload.error);
              }
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
              name={"mail"}
              type={"email"}
              placeholder={"E-Mail"}
              style={{
                borderBottom: "1px solid var(--ion-color-success-shade)",
              }}
            />
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
            </div>
          </div>
          <IonButton
            type={"submit"}
            style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}
            expand={"block"}
            color={"success"}
          >
            Anmelden
          </IonButton>
          <IonList inset>
            <IonItem
              color={"light"}
              routerLink={"/register"}
              routerDirection={"none"}
            >
              Stattdessen registrieren
            </IonItem>
          </IonList>
        </form>
      </Page>
    </>
  );
}
