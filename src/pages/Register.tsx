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
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { REST } from "../REST";

export default function Register() {
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
            Willkommen
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
                    borderBottom: "1px solid red",
                  }}
                />
                <IonInput
                  name={"mail"}
                  type={"email"}
                  placeholder={"E-Mail"}
                  style={{
                    borderBottom: "1px solid red",
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
                    borderBottom: "1px solid red",
                  }}
                />
                <IonInput
                  name={"lastName"}
                  placeholder={"Nachname"}
                  style={{
                    borderBottom: "1px solid red",
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
                    borderBottom: "1px solid red",
                  }}
                />
                <IonInput
                  name={"passConf"}
                  type={"password"}
                  placeholder={"Passwort bestätigen"}
                  style={{
                    borderBottom: "1px solid red",
                  }}
                />
              </div>
              <IonButton
                type={"submit"}
                style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}
                expand={"block"}
                color={"primary"}
              >
                Registrieren
              </IonButton>
              <IonText
                color={"primary"}
                onClick={() => {
                  router.push("/login", "none", "replace");
                }}
              >
                Du hast bereits ein Konto? Melde dich an!
              </IonText>
            </form>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
