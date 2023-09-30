/**
 * mobile/src/pages/admin/AdminSupportRequestDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { useParams } from "react-router";
import { Alert, AlertDescription, AlertIcon, VStack } from "@chakra-ui/react";
import { REST } from "@saveworld/api-js";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import PopupManager from "../../util/PopupManager";

export default function AdminSupportRequestDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const { id } = useParams<{ id: string }>();

  const [request, setRequest] = useState<{
    _id: string;
    email: string;
    category: string;
    additionalData: string;
    message: string;
    createdAt: string;
    processed: boolean;
    __v: number;
  } | null>(null);

  useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    REST.Admin.supportRequest(localStorage.getItem("token") as string, id).then(
      (res) => {
        if (res.status === 200) {
          setRequest(res.payload.entry);
        }
      },
    );
  };

  return (
    <>
      <Page title={"Anfrage"} redGradient noPadding>
        {request && (
          <>
            {request.processed && (
              <>
                <Alert status={"success"}>
                  <AlertIcon />
                  <AlertDescription>
                    Diese Anfrage ist bereits abgeschlossen
                  </AlertDescription>
                </Alert>
              </>
            )}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  {request.category === "REPORT-USER"
                    ? "Benutzer Meldung"
                    : request.category === "REPORT-POST"
                    ? "Beitrag Meldung"
                    : request.category === "REPORT-BUG"
                    ? "Bug Meldung"
                    : "Anderes"}
                </IonCardTitle>
                <IonCardSubtitle>
                  {new Date(request.createdAt).toLocaleString()}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <VStack spacing={"1rem"} alignItems={"left"} mb={"1rem"}>
                  <div>
                    <b>Erstellt von</b>: {request.email}
                  </div>
                  <div>
                    <b>Nachricht</b>: {request.message}
                  </div>
                </VStack>
                {["GENERAL", "REPORT-BUG"].includes(request.category) && (
                  <>
                    <IonButton
                      expand={"block"}
                      color={"success"}
                      disabled={request.processed}
                      onClick={async () => {
                        const message = await PopupManager.promptAsync({
                          title: "Antwort",
                          helperText: "Beantworte die Anfrage des Benutzers",
                          inputType: "TEXTAREA",
                        });

                        if (!message) return;

                        const res = await REST.Admin.processSupportRequest(
                          localStorage.getItem("token") as string,
                          id,
                          message,
                        );

                        if (res.status === 200) {
                          reload();
                        } else {
                          PopupManager.alert({
                            title: "Fehler",
                            description:
                              "Fehler beim Abschließen der Anfrage: " +
                              res.payload.error,
                          });
                        }
                      }}
                    >
                      Abschließen
                    </IonButton>
                  </>
                )}
                {request.category === "REPORT-POST" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                      }}
                    >
                      <IonButton
                        disabled={request.processed}
                        style={{
                          width: "100%",
                        }}
                        color={"success"}
                        routerLink={"/community/r/" + request.additionalData}
                      >
                        Beitrag öffnen
                      </IonButton>
                      <IonButton
                        disabled={request.processed}
                        style={{
                          width: "100%",
                        }}
                        color={"success"}
                        onClick={async () => {
                          const action = await PopupManager.selectAsync({
                            title: "Aktion auswählen",
                            helperText:
                              "Wähle die Aktion aus, die du durchführen möchtest",
                            choices: ["Beitrag löschen", "Keine Aktion"],
                          });
                          if (!action) return;

                          const message = await PopupManager.promptAsync({
                            title: "Antwort",
                            helperText: "Beantworte die Anfrage des Benutzers",
                            inputType: "TEXTAREA",
                          });
                          if (!message) return;

                          if (action === "Beitrag löschen") {
                            const res = await REST.Community.deleteBlogEntry(
                              localStorage.getItem("token") as string,
                              request.additionalData,
                            );

                            if (res.status !== 200) {
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Fehler beim Löschen des Beitrags: " +
                                  res.payload.error,
                              });
                              return;
                            }
                          }

                          const res = await REST.Admin.processSupportRequest(
                            localStorage.getItem("token") as string,
                            id,
                            message,
                          );

                          if (res.status === 200) {
                            reload();
                          } else {
                            PopupManager.alert({
                              title: "Fehler",
                              description:
                                "Fehler beim Abschließen der Anfrage: " +
                                res.payload.error,
                            });
                          }
                        }}
                      >
                        Abschließen
                      </IonButton>
                    </div>
                  </>
                )}
                {request.category === "REPORT-USER" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                      }}
                    >
                      <IonButton
                        disabled={request.processed}
                        style={{
                          width: "100%",
                        }}
                        color={"success"}
                        routerLink={"/community/u/" + request.additionalData}
                      >
                        Profil öffnen
                      </IonButton>
                      <IonButton
                        disabled={request.processed}
                        style={{
                          width: "100%",
                        }}
                        color={"success"}
                        onClick={async () => {
                          const action = await PopupManager.selectAsync({
                            title: "Aktion auswählen",
                            helperText:
                              "Wähle die Aktion aus, die du durchführen möchtest",
                            choices: ["Benutzer löschen", "Keine Aktion"],
                          });
                          if (!action) return;

                          const message = await PopupManager.promptAsync({
                            title: "Antwort",
                            helperText: "Beantworte die Anfrage des Benutzers",
                            inputType: "TEXTAREA",
                          });
                          if (!message) return;

                          if (action === "Benutzer löschen") {
                            const res = await REST.Admin.deleteUser(
                              localStorage.getItem("token") as string,
                              request.additionalData,
                            );

                            if (res.status !== 200) {
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Fehler beim Löschen des Benutzers: " +
                                  res.payload.error,
                              });
                              return;
                            }
                          }

                          const res = await REST.Admin.processSupportRequest(
                            localStorage.getItem("token") as string,
                            id,
                            message,
                          );

                          if (res.status === 200) {
                            reload();
                          } else {
                            PopupManager.alert({
                              title: "Fehler",
                              description:
                                "Fehler beim Abschließen der Anfrage: " +
                                res.payload.error,
                            });
                          }
                        }}
                      >
                        Abschließen
                      </IonButton>
                    </div>
                  </>
                )}
              </IonCardContent>
            </IonCard>
          </>
        )}
      </Page>
    </>
  );
}
