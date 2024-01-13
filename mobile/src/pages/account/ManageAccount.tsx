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
  isPlatform,
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
import PopupManager from "../../util/PopupManager";
import {
  Avatar,
  Box,
  Flex,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import OneSignal from "onesignal-cordova-plugin";
import MobileBox from "../../components/MobileBox";
import ManageAccountInterests from "../../components/ManageAccountInterests";
import SaveWorldModal from "../../components/SaveWorldModal";

export default function ManageAccount() {
  const { loggedIn, loaded, userInfo } = useUserData();
  const router = useIonRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <MobileBox>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  gap: "1.2rem",
                  marginBottom: "1.2rem",
                  marginTop: "1.2rem",
                }}
              >
                <Avatar
                  size={"lg"}
                  src={
                    preferences && preferences.picture
                      ? preferences.picture
                      : "/blank-profile-picture-973460_1280.png"
                  }
                />
                <Flex direction={"column"} alignItems={"start"}>
                  <Heading
                    fontSize={"2xl"}
                    fontWeight={1000}
                    textAlign={"center"}
                  >
                    {userInfo.firstName} {userInfo.lastName}
                  </Heading>
                  <Text
                    fontSize={"md"}
                    fontWeight={500}
                    textAlign={"center"}
                    color={"gray.500"}
                  >
                    {userInfo.email}
                  </Text>
                </Flex>
              </div>
              <Grid
                gap={4}
                templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
              >
                <Box>
                  <IonList
                    inset
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <IonText>Generelles</IonText>
                  </IonList>
                  <IonList
                    inset
                    style={{
                      height: "fit-content",
                    }}
                  >
                    <IonItem
                      color={"light"}
                      detail
                      button
                      onClick={() => {
                        const fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.accept = "image/*";

                        fileInput.addEventListener("change", async (e) => {
                          const file = (e.target as any).files[0];
                          const formData = new FormData();
                          formData.append("file", file);
                          const mediaRes = await fetch(
                            ENDPOINT + "/media/upload",
                            {
                              method: "POST",
                              body: formData,
                            },
                          );

                          if (mediaRes.status === 200) {
                            const res = await REST.Account.updatePreferences(
                              localStorage.getItem("token") as string,
                              {
                                picture:
                                  ENDPOINT + (await mediaRes.json()).data.url,
                              },
                            );

                            if (res.status === 200) {
                              PopupManager.alert({
                                title: "Erfolg",
                                description: "Der Upload war erfolgreich!",
                                callback: () => {
                                  router.push(router.routeInfo.pathname);
                                },
                              });
                            } else {
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Fehler beim Speichern: " + res.payload.error,
                              });
                            }
                          } else {
                            PopupManager.alert({
                              title: "Fehler",
                              description:
                                "Fehler beim Upload: " + mediaRes.statusText,
                            });
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
                      button
                      color={"light"}
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: "Profilbild entfernen",
                            question:
                              "Bist du sicher, dass du dein Profilbild entfernen möchtest?",
                          }))
                        )
                          return;

                        const res = await REST.Account.updatePreferences(
                          localStorage.getItem("token") as string,
                          {
                            picture: "",
                          },
                        );

                        if (res.status === 200) {
                          PopupManager.alert({
                            title: "Erfolg",
                            description:
                              "Dein Profilbild wurde erfolgreich entfernt!",
                            callback: () => {
                              router.push(router.routeInfo.pathname);
                            },
                          });
                        } else {
                          PopupManager.alert({
                            title: "Fehler",
                            description:
                              "Dein Profilbild konnte nicht entfernt werden!",
                          });
                        }
                      }}
                    >
                      <IonText color={"danger"}>Profilbild entfernen</IonText>
                    </IonItem>
                    <IonItem
                      color={"light"}
                      detail
                      button
                      routerLink={"/welcome"}
                      routerDirection={"none"}
                    >
                      <IonText>Einleitung erneut öffnen</IonText>
                    </IonItem>
                  </IonList>
                </Box>
                <Box>
                  <IonList
                    inset
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
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
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={"Vorname"}
                        value={userInfo.firstName}
                        name={"firstName"}
                        id={"firstName_upd"}
                      />
                    </IonItem>
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={"Nachname"}
                        value={userInfo.lastName}
                        name={"lastName"}
                        id={"lastName_upd"}
                      />
                    </IonItem>
                    <IonItem
                      color={"light"}
                      button
                      onClick={async () => {
                        const firstName = (
                          document.getElementById(
                            "firstName_upd",
                          ) as HTMLInputElement
                        ).value;
                        const lastName = (
                          document.getElementById(
                            "lastName_upd",
                          ) as HTMLInputElement
                        ).value;

                        const res = await REST.Account.update(
                          localStorage.getItem("token") as string,
                          {
                            firstName: firstName,
                            lastName: lastName,
                          },
                        );

                        if (res.status === 200) {
                          PopupManager.alert({
                            title: "Erfolg",
                            description:
                              "Die Daten wurden erfolgreich gespeichert!",
                            callback: () => {
                              router.push(router.routeInfo.pathname);
                            },
                          });
                        } else {
                          PopupManager.alert({
                            title: "Fehler",
                            description:
                              "Fehler beim Speichern: " + res.payload.error,
                          });
                        }
                      }}
                    >
                      <IonText color={"primary"}>Speichern</IonText>
                    </IonItem>
                    <IonItem
                      color={"light"}
                      detail
                      button
                      onClick={() => {
                        onOpen();
                      }}
                    >
                      <IonText>Interessen</IonText>
                    </IonItem>
                  </IonList>
                </Box>
                <Box>
                  <IonList
                    inset
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
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
                      button
                      color={"light"}
                      onClick={async () => {
                        const pass = (
                          document.getElementById("acc_change_pass") as any
                        ).value;
                        const passConf = (
                          document.getElementById("acc_change_pass_conf") as any
                        ).value;

                        if (
                          pass !== passConf ||
                          pass === "" ||
                          passConf === ""
                        ) {
                          PopupManager.alert({
                            title: "Fehler",
                            description: "Passwörter stimmen nicht überein!",
                          });
                          return;
                        }

                        const res = await REST.Account.update(
                          localStorage.getItem("token") as string,
                          {
                            password: pass,
                          },
                        );

                        if (res.status === 200) {
                          PopupManager.alert({
                            title: "Erfolg",
                            description:
                              "Die Daten wurden erfolgreich gespeichert!",
                            callback: () => {
                              router.push(router.routeInfo.pathname);
                            },
                          });
                        } else {
                          PopupManager.alert({
                            title: "Fehler",
                            description:
                              "Fehler beim Speichern: " + res.payload.error,
                            callback: () => {
                              router.push(router.routeInfo.pathname);
                            },
                          });
                        }
                      }}
                    >
                      <IonText color={"primary"}>Speichern</IonText>
                    </IonItem>
                  </IonList>
                </Box>
                <Box>
                  <IonList
                    inset
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
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
                            PopupManager.alert({
                              title: "Erfolg",
                              description:
                                "Erfolgreich aktiviert! Trage folgenden Code in deiner App ein: " +
                                res.payload.totpSecret,
                              callback: () => {
                                router.push(router.routeInfo.pathname);
                              },
                            });
                          } else {
                            PopupManager.alert({
                              title: "Fehler",
                              description:
                                "Fehler beim Aktivieren: " + res.payload.error,
                            });
                          }
                        } else {
                          const code = await PopupManager.promptAsync({
                            title: "2FA Code",
                            helperText: "Bitte gebe den 2FA Code ein",
                            inputType: "INPUT",
                          });

                          if (!code) return;

                          const res = await REST.Account.update(
                            localStorage.getItem("token") as string,
                            {
                              totpCode: code,
                              totpActive: false,
                            },
                          );

                          if (res.status === 200) {
                            PopupManager.alert({
                              title: "Erfolgreich deaktiviert",
                              description:
                                "Zwei Faktor Authentifizierung deaktiviert",
                              callback: () => {
                                router.push(router.routeInfo.pathname);
                              },
                            });
                          } else {
                            PopupManager.alert({
                              title: "Fehler",
                              description:
                                "Fehler beim Deaktivieren: " +
                                res.payload.error,
                            });
                          }
                        }
                      }}
                      button
                    >
                      <IonLabel
                        color={userInfo.totpActive ? "danger" : "success"}
                      >
                        {userInfo.totpActive ? "Deaktivieren" : "Aktivieren"}
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </Box>
                <Box>
                  <IonList
                    inset
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <IonText>Destruktive Aktionen</IonText>
                  </IonList>
                  <IonList inset>
                    <IonItem
                      color={"light"}
                      button
                      detail
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: "Abmelden",
                            question:
                              "Bist du sicher, dass du dich abmelden möchtest?",
                          }))
                        ) {
                          return;
                        }

                        try {
                          if (!isPlatform("desktop")) {
                            OneSignal.logout();
                          }
                        } catch (e) {}
                        localStorage.removeItem("token");
                        router.push("/register");
                      }}
                    >
                      <IonText color={"danger"}>Abmelden</IonText>
                    </IonItem>
                    <IonItem
                      color={"light"}
                      detail
                      button
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: "Konto löschen",
                            question:
                              "Bist du sicher, dass du dein Konto löschen möchtest?",
                          }))
                        )
                          return;

                        const res = await REST.Account.delete(
                          localStorage.getItem("token") as string,
                        );

                        if (res.status === 200) {
                          localStorage.removeItem("token");
                          router.push("/register");
                        } else {
                          PopupManager.alert({
                            title: "Fehler",
                            description:
                              "Fehler beim Löschen, bitte kontaktiere den Support: " +
                              res.payload.error,
                          });
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
                </Box>
                <Box>
                  <IonList
                    inset
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <IonText>Informationen</IonText>
                  </IonList>
                  <IonList inset>
                    <IonItem
                      color={"light"}
                      detail
                      button
                      onClick={() => {
                        Browser.open({
                          url: "https://saveworld.one/legal/privacy",
                        });
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
                      button
                      onClick={() => {
                        Browser.open({
                          url: "https://saveworld.one/legal/notice",
                        });
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
                      button
                      onClick={() => {
                        Browser.open({
                          url: "https://status.saveworld.one/status/saveworld",
                        });
                      }}
                    >
                      <IonIcon
                        slot={"start"}
                        ios={analytics}
                        md={analyticsSharp}
                      />
                      <IonText>Server Status</IonText>
                    </IonItem>
                    <IonItem
                      color={"light"}
                      detail
                      button
                      onClick={async () => {
                        router.push("/account/licenses");
                      }}
                    >
                      <IonIcon
                        slot={"start"}
                        ios={ionDocument}
                        md={ionDocumentSharp}
                      />
                      <IonText>Open-Source Lizensen</IonText>
                    </IonItem>
                  </IonList>
                </Box>
              </Grid>
            </MobileBox>
          </>
        )}
        <SaveWorldModal title={"Interessen"} isOpen={isOpen} onClose={onClose}>
          <ManageAccountInterests />
        </SaveWorldModal>
      </Page>
    </>
  );
}
