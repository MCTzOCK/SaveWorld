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
              router.push("/welcome", "none", "replace");
            } else {
              if (res.payload.error === "TOTP Code incorrect") {
                const code = prompt("Bitte gebe den 2FA Code ein");

                if (!code) return;
                const resp = await REST.Account.login(mail, pass, code);

                if (resp.status === 200) {
                  localStorage.setItem("token", resp.payload.token);
                  router.push("/welcome", "none", "replace");
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
                borderBottom: "1px solid red",
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
                  borderBottom: "1px solid red",
                }}
              />
            </div>
          </div>
          <IonButton
            type={"submit"}
            style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}
            expand={"block"}
            color={"primary"}
          >
            Anmelden
          </IonButton>
          <IonText
            color={"primary"}
            onClick={() => {
              router.push("/register", "none", "replace");
            }}
          >
            Du hast noch kein Konto? Registrieren!
          </IonText>
        </form>
      </Page>
    </>
  );
}
