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
  IonAvatar,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import {
  document as ionDocument,
  documentSharp as ionDocumentSharp,
  warning,
  warningSharp,
  analytics,
  analyticsSharp,
  pencil,
  pencilSharp,
} from "ionicons/icons";
import { REST } from "@saveworld/api-js";
import { Browser } from "@capacitor/browser";
import { useEffect } from "react";
import { ENDPOINT } from "../../env";

export default function ManageAccount() {
  const { loggedIn, loaded, userInfo } = useUserData();

  const [preferences, setPreferences] = React.useState<{
    picture: string;
  } | null>(null);

  useRedirectForAnon();

  useEffect(() => {
    REST.Account.preferences(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setPreferences(res.payload.prefs);
        }
      },
    );
  }, []);

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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                gap: "1.2rem",
                marginBottom: "1.2rem",
              }}
            >
              <IonAvatar>
                <img
                  alt={""}
                  src={
                    preferences && preferences.picture
                      ? preferences.picture
                      : "/blank-profile-picture-973460_1280.png"
                  }
                />
              </IonAvatar>
            </div>
            <IonList inset>
              <IonItem
                color={"light"}
                detail
                onClick={() => {
                  const fileInput = document.createElement("input");
                  fileInput.type = "file";
                  fileInput.accept = "image/*";

                  fileInput.addEventListener("change", async (e) => {
                    const file = (e.target as any).files[0];
                    const formData = new FormData();
                    formData.append("file", file);
                    const mediaRes = await fetch(ENDPOINT + "/media/upload", {
                      method: "POST",
                      body: formData,
                    });

                    if (mediaRes.status === 200) {
                      const res = await REST.Account.updatePreferences(
                        localStorage.getItem("token") as string,
                        {
                          picture: ENDPOINT + (await mediaRes.json()).data.url,
                        },
                      );

                      if (res.status === 200) {
                        alert("Erfolgreich gespeichert!");
                        window.location.reload();
                      } else {
                        alert("Fehler beim speichern: " + res.payload.error);
                      }
                    } else {
                      alert("Fehler beim Upload: " + mediaRes.statusText);
                    }

                    (
                      document.querySelector(
                        "#manual-mount-point",
                      ) as HTMLDivElement
                    ).removeChild(fileInput);
                  });

                  fileInput.onchange = async (e) => {};
                  (
                    document.querySelector(
                      "#manual-mount-point",
                    ) as HTMLDivElement
                  ).appendChild(fileInput);
                  fileInput.click();
                }}
              >
                Profilbild Bearbeiten
              </IonItem>
              <IonItem
                detail
                color={"light"}
                onClick={async () => {
                  if (
                    !confirm(
                      "Bist du sicher, dass du dein Profilbild entfernen möchtest?",
                    )
                  )
                    return;
                  const res = await REST.Account.updatePreferences(
                    localStorage.getItem("token") as string,
                    {
                      picture: "",
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
                <IonText color={"danger"}>Profilbild entfernen</IonText>
              </IonItem>
            </IonList>

            <IonList inset>
              <IonItem
                color={"light"}
                detail
                routerLink={"/welcome"}
                routerDirection={"none"}
              >
                <IonText>Einleitung erneut öffnen</IonText>
              </IonItem>
            </IonList>

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
                  const firstName = (e.target as any).firstName.value;
                  const lastName = (e.target as any).lastName.value;

                  const res = await REST.Account.update(
                    localStorage.getItem("token") as string,
                    {
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
              <IonItem color={"light"} detail routerLink={"/account/interests"}>
                <IonText>Interessen</IonText>
              </IonItem>
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
              <IonText>Zwei Faktor Authentifizierung</IonText>
            </IonList>
            <IonList inset>
              <IonItem
                color={"light"}
                detail
                onClick={async () => {
                  if (!userInfo.totpActive) {
                    const res = await REST.Account.update(
                      localStorage.getItem("token") as string,
                      {
                        totpActive: true,
                      },
                    );

                    if (res.status === 200) {
                      alert("Erfolgreich aktiviert!");
                      prompt(
                        "Trage den Code in deiner App ein:",
                        res.payload.totpSecret,
                      );
                      window.location.reload();
                    } else {
                      alert("Fehler beim Aktivieren: " + res.payload.error);
                    }
                  } else {
                    const code = prompt("Bitte 2FA Code eingeben:");

                    if (!code) return;

                    const res = await REST.Account.update(
                      localStorage.getItem("token") as string,
                      {
                        totpCode: code,
                        totpActive: false,
                      },
                    );

                    if (res.status === 200) {
                      alert("Erfolgreich deaktiviert!");
                      window.location.reload();
                    } else {
                      alert("Fehler beim Deaktivieren: " + res.payload.error);
                    }
                  }
                }}
              >
                <IonLabel color={userInfo.totpActive ? "danger" : "success"}>
                  {userInfo.totpActive ? "Deaktivieren" : "Aktivieren"}
                </IonLabel>
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

              {userInfo.role === "admin" && (
                <IonItem color={"light"} detail routerLink={"/admin"}>
                  <IonIcon
                    color={"danger"}
                    slot={"start"}
                    ios={warning}
                    md={warningSharp}
                  />
                  <IonText color={"danger"}>Admin-Panel</IonText>
                </IonItem>
              )}
            </IonList>
            <IonList inset>
              <IonText>Informationen</IonText>
            </IonList>
            <IonList inset>
              <IonItem
                color={"light"}
                detail
                onClick={() => {
                  Browser.open({ url: "https://saveworld.one/privacy" });
                }}
              >
                <IonIcon
                  slot={"start"}
                  ios={ionDocument}
                  md={ionDocumentSharp}
                />
                <IonText>Datenschutz</IonText>
              </IonItem>
              <IonItem
                color={"light"}
                detail
                onClick={() => {
                  Browser.open({ url: "https://saveworld.one/legal-notice" });
                }}
              >
                <IonIcon
                  slot={"start"}
                  ios={ionDocument}
                  md={ionDocumentSharp}
                />
                <IonText>Impressum</IonText>
              </IonItem>
              <IonItem
                color={"light"}
                detail
                onClick={() => {
                  Browser.open({
                    url: "https://status.saveworld.one/status/saveworld",
                  });
                }}
              >
                <IonIcon slot={"start"} ios={analytics} md={analyticsSharp} />
                <IonText>Server Status</IonText>
              </IonItem>
            </IonList>
          </>
        )}
      </Page>
    </>
  );
}
