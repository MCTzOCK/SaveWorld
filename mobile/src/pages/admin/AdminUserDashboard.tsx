/**
 * /AdminUserDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useParams } from "react-router";
import Page from "../../components/Page";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonToggle,
  useIonRouter,
} from "@ionic/react";
import { warning, warningSharp } from "ionicons/icons";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";
import { Box, Flex } from "@chakra-ui/react";
import { __ } from "../../translations/i18n";

export default function AdminUserDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [user, setUser] = useState<{
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    password: string;
    updatedAt: string;
    totpSecret: string;
    active: boolean;
    role: string;
    activationToken: string;
  }>({
    id: "",
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    createdAt: "",
    password: "",
    updatedAt: "",
    totpSecret: "",
    active: false,
    role: "",
    activationToken: "",
  });

  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    if (id) {
      REST.Admin.users(localStorage.getItem("token") as string, id).then(
        (res) => {
          if (res.status === 200) {
            setUser(res.payload.users[0]);
          } else {
            PopupManager.alert({
              title: __("control.error"),
              description: __(
                "pages.admin.user.loading.error",
                res.payload.error,
              ),
            });
          }
          setLoading(false);
        },
      );
    }
  }, [id]);

  const router = useIonRouter();

  return (
    <>
      <Page title={user.username} redGradient>
        {loading && (
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
        {!loading && (
          <>
            <Flex
              w={"100%"}
              justifyContent={["flex-start", "center"]}
              alignItems={["flex-start", "center"]}
              minH={"100vh"}
            >
              <Box w={["100%", "75%", "50%", "25%"]} minW={"200px"}>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>{__("menu.settings")}</IonCardTitle>
                    <IonCardSubtitle>
                      {user.firstName} {user.lastName}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();

                        const mail = (e.target as any).mail.value;
                        const firstName = (e.target as any).firstName.value;
                        const lastName = (e.target as any).lastName.value;
                        const password = (e.target as any).password.value;
                        const active = (
                          document.getElementById(
                            "admin_change_user_settings_active",
                          ) as HTMLIonToggleElement
                        ).checked;
                        const admin = (
                          document.getElementById(
                            "admin_change_user_settings_admin",
                          ) as HTMLIonToggleElement
                        ).checked;

                        const res = await REST.Admin.updateUser(
                          localStorage.getItem("token") as string,
                          id,
                          {
                            email: mail,
                            firstName: firstName,
                            lastName: lastName,
                            password: password === "" ? undefined : password,
                            active: active,
                            role: admin ? "admin" : "user",
                          },
                        );

                        if (res.status === 200) {
                          PopupManager.alert({
                            title: __("control.success"),
                            description: __("pages.admin.user.saved"),
                            callback: () => {
                              router.push(router.routeInfo.pathname);
                            },
                          });
                        } else {
                          PopupManager.alert({
                            title: __("control.error"),
                            description: __(
                              "pages.admin.user.save.error",
                              res.payload.error,
                            ),
                          });
                        }
                      }}
                    >
                      <IonList
                        inset
                        style={{
                          margin: 0,
                        }}
                      >
                        <IonItem color={"light"}>
                          <IonInput
                            labelPlacement={"fixed"}
                            label={__("user.username")}
                            disabled
                            value={user.username}
                          />
                        </IonItem>
                        <IonItem color={"light"}>
                          <IonInput
                            labelPlacement={"fixed"}
                            label={__("user.email")}
                            value={user.email}
                            name={"mail"}
                          />
                        </IonItem>
                        <IonItem color={"light"}>
                          <IonInput
                            labelPlacement={"fixed"}
                            label={__("user.firstname")}
                            value={user.firstName}
                            name={"firstName"}
                          />
                        </IonItem>
                        <IonItem color={"light"}>
                          <IonInput
                            labelPlacement={"fixed"}
                            label={__("user.lastname")}
                            value={user.lastName}
                            name={"lastName"}
                          />
                        </IonItem>
                        <IonItem color={"light"}>
                          <IonInput
                            labelPlacement={"fixed"}
                            label={__("user.password")}
                            value={""}
                            type={"password"}
                            name={"password"}
                          />
                        </IonItem>
                        <IonItem color={"light"}>
                          <IonToggle
                            labelPlacement={"fixed"}
                            id={"admin_change_user_settings_active"}
                            checked={user.active}
                            color={"danger"}
                          >
                            <IonLabel>{__("general.active")}</IonLabel>
                          </IonToggle>
                        </IonItem>
                        <IonItem color={"light"}>
                          <IonIcon
                            slot={"start"}
                            ios={warning}
                            md={warningSharp}
                            color={"danger"}
                          />
                          <IonToggle
                            labelPlacement={"fixed"}
                            id={"admin_change_user_settings_admin"}
                            checked={user.role === "admin"}
                            color={"danger"}
                          >
                            <IonLabel color={"danger"}>
                              {__("menu.admin")}
                            </IonLabel>
                          </IonToggle>
                        </IonItem>
                      </IonList>
                      <IonButton
                        type={"submit"}
                        expand={"block"}
                        style={{
                          marginTop: "1.2rem",
                        }}
                      >
                        {__("control.save")}
                      </IonButton>
                      <IonButton
                        expand={"block"}
                        color={"danger"}
                        style={{
                          marginTop: "1.2rem",
                        }}
                        onClick={async () => {
                          const res = await REST.Admin.deleteUser(
                            localStorage.getItem("token") as string,
                            id,
                          );
                          if (res.status === 200) {
                            PopupManager.alert({
                              title: __("control.success"),
                              description: __("pages.admin.user.deleted"),
                              callback: () => {
                                router.goBack();
                              },
                            });
                          } else {
                            PopupManager.alert({
                              title: __("control.error"),
                              description: __(
                                "pages.admin.user.delete.error",
                                res.payload.error,
                              ),
                            });
                          }
                        }}
                      >
                        {__("control.delete")}
                      </IonButton>
                    </form>
                  </IonCardContent>
                </IonCard>
              </Box>
            </Flex>
          </>
        )}
      </Page>
    </>
  );
}
