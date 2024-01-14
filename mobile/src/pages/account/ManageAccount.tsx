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
import { __ } from "../../translations/i18n";

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
      <Page title={__("general.account")}>
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
                    <IonText>{__("page.account.general")}</IonText>
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
                                title: __("control.success"),
                                description: __("control.upload.success"),
                                callback: () => {
                                  router.push(router.routeInfo.pathname);
                                },
                              });
                            } else {
                              PopupManager.alert({
                                title: __("control.error"),
                                description: __(
                                  "control.upload.error",
                                  res.payload.error,
                                ),
                              });
                            }
                          } else {
                            PopupManager.alert({
                              title: __("control.error"),
                              description: __(
                                "control.upload.error",
                                mediaRes.status.toString(),
                              ),
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
                      {__("page.account.update.pfp")}
                    </IonItem>
                    <IonItem
                      detail
                      button
                      color={"light"}
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: __("page.account.delete.pfp.title"),
                            question: __("page.account.delete.pfp.description"),
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
                            title: __("control.success"),
                            description: __("page.account.delete.pfp.success"),
                            callback: () => {
                              router.push(router.routeInfo.pathname);
                            },
                          });
                        } else {
                          PopupManager.alert({
                            title: __("control.error"),
                            description: __(
                              "page.account.delete.pfp.error",
                              res.payload.error,
                            ),
                          });
                        }
                      }}
                    >
                      <IonText color={"danger"}>
                        {__("page.account.delete.pfp.title")}
                      </IonText>
                    </IonItem>
                    <IonItem
                      color={"light"}
                      detail
                      button
                      routerLink={"/welcome"}
                      routerDirection={"none"}
                    >
                      <IonText>{__("page.account.intro.open.again")}</IonText>
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
                    <IonText>{__("page.account.info")}</IonText>
                  </IonList>
                  <IonList inset>
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={__("user.username")}
                        value={userInfo.username}
                        disabled={true}
                      />
                    </IonItem>
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={__("user.firstname")}
                        value={userInfo.firstName}
                        name={"firstName"}
                        id={"firstName_upd"}
                      />
                    </IonItem>
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={__("user.lastname")}
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
                            title: __("control.success"),
                            description: __("page.account.info.update.success"),
                            callback: () => {
                              router.push(router.routeInfo.pathname);
                            },
                          });
                        } else {
                          PopupManager.alert({
                            title: __("control.error"),
                            description: __(
                              "page.account.info.update.error",
                              res.payload.error,
                            ),
                          });
                        }
                      }}
                    >
                      <IonText color={"primary"}>{__("control.save")}</IonText>
                    </IonItem>
                    <IonItem
                      color={"light"}
                      detail
                      button
                      onClick={() => {
                        onOpen();
                      }}
                    >
                      <IonText>{__("menu.interests")}</IonText>
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
                    <IonText>{__("page.account.update.password")}</IonText>
                  </IonList>
                  <IonList inset>
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={__("page.account.update.password.new")}
                        type={"password"}
                        id={"acc_change_pass"}
                      />
                    </IonItem>
                    <IonItem color={"light"}>
                      <IonInput
                        labelPlacement={"fixed"}
                        label={__("page.account.update.password.new.confirm")}
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
                            title: __("control.error"),
                            description: __("form.passwords.error.not.match"),
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
                            title: __("control.success"),
                            description: __(
                              "page.account.update.password.success",
                            ),
                            callback: () => {
                              router.push(router.routeInfo.pathname);
                            },
                          });
                        } else {
                          PopupManager.alert({
                            title: __("control.error"),
                            description: __(
                              "page.account.update.password.error",
                              res.payload.error,
                            ),
                            callback: () => {
                              router.push(router.routeInfo.pathname);
                            },
                          });
                        }
                      }}
                    >
                      <IonText color={"primary"}>{__("control.save")}</IonText>
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
                    <IonText>{__("page.account.2fa")}</IonText>
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
                              title: __("control.success"),
                              description: __(
                                "page.account.2fa.activated",
                                res.payload.totpSecret,
                              ),
                              callback: () => {
                                router.push(router.routeInfo.pathname);
                              },
                            });
                          } else {
                            PopupManager.alert({
                              title: __("control.error"),
                              description: __(
                                "page.account.2fa.error",
                                res.payload.error,
                              ),
                            });
                          }
                        } else {
                          const code = await PopupManager.promptAsync({
                            title: __("page.login.2fa.popup.title"),
                            helperText: __("page.login.2fa.popup.description"),
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
                              title: __("page.account.2fa.deactivated"),
                              description: __(
                                "page.account.2fa.deactivated.description",
                              ),
                              callback: () => {
                                router.push(router.routeInfo.pathname);
                              },
                            });
                          } else {
                            PopupManager.alert({
                              title: __("control.error"),
                              description: __(
                                "page.account.2fa.deactivated.error",
                                res.payload.error,
                              ),
                            });
                          }
                        }
                      }}
                      button
                    >
                      <IonLabel
                        color={userInfo.totpActive ? "danger" : "success"}
                      >
                        {userInfo.totpActive
                          ? __("control.deactivate")
                          : __("control.activate")}
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
                    <IonText>{__("page.account.dangerzone")}</IonText>
                  </IonList>
                  <IonList inset>
                    <IonItem
                      color={"light"}
                      button
                      detail
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: __("menu.logout"),
                            question: __("menu.logout.description"),
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
                      <IonText color={"danger"}>{__("menu.logout")}</IonText>
                    </IonItem>
                    <IonItem
                      color={"light"}
                      detail
                      button
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: __("page.account.delete.account"),
                            question: __(
                              "page.account.delete.account.description",
                            ),
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
                            title: __("control.error"),
                            description: __(
                              "page.account.delete.account.error",
                              res.payload.error,
                            ),
                          });
                        }
                      }}
                    >
                      <IonText color={"danger"}>
                        {__("page.account.delete.account")}
                      </IonText>
                    </IonItem>

                    {userInfo.role === "admin" && (
                      <IonItem color={"light"} detail routerLink={"/admin"}>
                        <IonIcon
                          color={"danger"}
                          slot={"start"}
                          ios={warning}
                          md={warningSharp}
                        />
                        <IonText color={"danger"}>
                          {__("page.admin.title.outside")}
                        </IonText>
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
                    <IonText>{__("general.information")}</IonText>
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
                      <IonText>{__("general.legal.privacy")}</IonText>
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
                      <IonText>{__("general.legal.notice")}</IonText>
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
                      <IonText>{__("general.serverstatus")}</IonText>
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
                      <IonText>{__("general.open.source.licenses")}</IonText>
                    </IonItem>
                  </IonList>
                </Box>
              </Grid>
            </MobileBox>
          </>
        )}
        <SaveWorldModal
          title={__("menu.interests")}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ManageAccountInterests />
        </SaveWorldModal>
      </Page>
    </>
  );
}
