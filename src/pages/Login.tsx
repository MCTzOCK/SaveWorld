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
import { REST } from "../REST";

export default function Login() {
  const router = useIonRouter();
  return (
    <>
      <IonPage>
        <IonContent
          fullscreen
          style={{
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "0",
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                background: "linear-gradient(45deg, #8BFE6B 30%, #538EFF 90%)",
                width: "100%",
                height: "25%",
                rotate: "180deg",
              }}
            ></div>
          </div>
          <IonText
            style={{
              fontSize: "50px",
              fontWeight: "bold",
              position: "relative",
              top: "15%",
              left: "5%",
            }}
            color={"white"}
          >
            Anmelden
          </IonText>
          <div
            style={{
              position: "relative",
              top: "25%",
              left: "5%",
              width: "90%",
            }}
          >
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const mail = (e.target as any).mail.value;
                const pass = (e.target as any).pass.value;

                const res = await REST.Account.login(mail, pass);

                if (res.status === 200) {
                  localStorage.setItem("token", res.payload.token);
                  router.push("/", "none", "replace");
                } else {
                  alert("Fehler beim anmelden: " + res.payload.error);
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
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
