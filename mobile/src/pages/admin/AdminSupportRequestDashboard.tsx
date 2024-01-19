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
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Flex,
  VStack,
} from "@chakra-ui/react";
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
import { $$ } from "../../translations/i18n";

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
      <Page title={$$("pages.admin.support.request")} redGradient noPadding>
        <Flex
          w={"100%"}
          justifyContent={["flex-start", "center"]}
          alignItems={["flex-start", "center"]}
          minH={"100vh"}
        >
          <Box
            backgroundColor={"rgba(10,10,10,0.5)"}
            borderRadius={"12px"}
            border={"4px solid rgba(40,40,40,1)"}
            w={["100%", "75%", "50%", "25%"]}
            minW={"200px"}
          >
            {request && (
              <>
                {request.processed && (
                  <>
                    <Alert
                      status={"success"}
                      borderTopRightRadius={[0, "8px"]}
                      borderTopLeftRadius={[0, "8px"]}
                    >
                      <AlertIcon />
                      <AlertDescription>
                        {$$("pages.admin.support.request.processed")}
                      </AlertDescription>
                    </Alert>
                  </>
                )}
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>
                      {request.category === "REPORT-USER"
                        ? $$("page.support.category.report.user")
                        : request.category === "REPORT-POST"
                        ? $$("page.support.category.report.post")
                        : request.category === "REPORT-BUG"
                        ? $$("page.support.category.error")
                        : $$("page.support.category.general")}
                    </IonCardTitle>
                    <IonCardSubtitle>
                      {new Date(request.createdAt).toLocaleString()}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <VStack spacing={"1rem"} alignItems={"left"} mb={"1rem"}>
                      <div>
                        <b>{$$("pages.admin.support.request.created.by")}</b>:{" "}
                        {request.email}
                      </div>
                      <div>
                        <b>{$$("pages.admin.support.request.message")}</b>:{" "}
                        {request.message}
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
                              title: $$("pages.admin.support.request.answer"),
                              helperText: $$(
                                "pages.admin.support.request.answer.description",
                              ),
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
                                title: $$("control.error"),
                                description: $$(
                                  "pages.admin.support.request.answer.error",
                                  res.payload.error,
                                ),
                              });
                            }
                          }}
                        >
                          {$$("pages.admin.support.request.answer.complete")}
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
                            routerLink={
                              "/community/r/" + request.additionalData
                            }
                          >
                            {$$("pages.admin.support.request.open.post")}
                          </IonButton>
                          <IonButton
                            disabled={request.processed}
                            style={{
                              width: "100%",
                            }}
                            color={"success"}
                            onClick={async () => {
                              const action = await PopupManager.selectAsync({
                                title: $$(
                                  "pages.admin.support.request.action.choose",
                                ),
                                helperText: $$(
                                  "pages.admin.support.request.action.description",
                                ),
                                choices: [
                                  $$(
                                    "pages.admin.support.request.action.delete.post",
                                  ),
                                  $$("pages.admin.support.request.action.no"),
                                ],
                              });
                              if (!action) return;

                              const message = await PopupManager.promptAsync({
                                title: $$("pages.admin.support.request.answer"),
                                helperText: $$(
                                  "pages.admin.support.request.answer.description",
                                ),
                                inputType: "TEXTAREA",
                              });
                              if (!message) return;

                              if (
                                action ===
                                $$(
                                  "pages.admin.support.request.action.delete.post",
                                )
                              ) {
                                const res =
                                  await REST.Community.deleteBlogEntry(
                                    localStorage.getItem("token") as string,
                                    request.additionalData,
                                  );

                                if (res.status !== 200) {
                                  PopupManager.alert({
                                    title: $$("control.error"),
                                    description: $$(
                                      "pages.admin.support.request.error.post",
                                      res.payload.error,
                                    ),
                                  });
                                  return;
                                }
                              }

                              const res =
                                await REST.Admin.processSupportRequest(
                                  localStorage.getItem("token") as string,
                                  id,
                                  message,
                                );

                              if (res.status === 200) {
                                reload();
                              } else {
                                PopupManager.alert({
                                  title: $$("control.error"),
                                  description: $$(
                                    "pages.admin.support.request.error",
                                    res.payload.error,
                                  ),
                                });
                              }
                            }}
                          >
                            {$$("pages.admin.support.request.answer.complete")}
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
                            routerLink={
                              "/community/u/" + request.additionalData
                            }
                          >
                            {$$("pages.admin.support.request.open.profile")}
                          </IonButton>
                          <IonButton
                            disabled={request.processed}
                            style={{
                              width: "100%",
                            }}
                            color={"success"}
                            onClick={async () => {
                              const action = await PopupManager.selectAsync({
                                title: $$(
                                  "pages.admin.support.request.action.choose",
                                ),
                                helperText: $$(
                                  "pages.admin.support.request.action.description",
                                ),
                                choices: [
                                  $$(
                                    "pages.admin.support.request.action.delete.user",
                                  ),
                                  $$("pages.admin.support.request.action.no"),
                                ],
                              });
                              if (!action) return;

                              const message = await PopupManager.promptAsync({
                                title: $$("pages.admin.support.request.answer"),
                                helperText: $$(
                                  "pages.admin.support.request.answer.description",
                                ),
                                inputType: "TEXTAREA",
                              });
                              if (!message) return;

                              if (
                                action ===
                                $$(
                                  "pages.admin.support.request.action.delete.user",
                                )
                              ) {
                                const res = await REST.Admin.deleteUser(
                                  localStorage.getItem("token") as string,
                                  request.additionalData,
                                );

                                if (res.status !== 200) {
                                  PopupManager.alert({
                                    title: $$("control.error"),
                                    description: $$(
                                      "pages.admin.support.request.error.user",
                                      res.payload.error,
                                    ),
                                  });
                                  return;
                                }
                              }

                              const res =
                                await REST.Admin.processSupportRequest(
                                  localStorage.getItem("token") as string,
                                  id,
                                  message,
                                );

                              if (res.status === 200) {
                                reload();
                              } else {
                                PopupManager.alert({
                                  title: $$("control.error"),
                                  description: $$(
                                    "pages.admin.support.request.error",
                                    res.payload.error,
                                  ),
                                });
                              }
                            }}
                          >
                            {$$("pages.admin.support.request.answer.complete")}
                          </IonButton>
                        </div>
                      </>
                    )}
                  </IonCardContent>
                </IonCard>
              </>
            )}
          </Box>
        </Flex>
      </Page>
    </>
  );
}
