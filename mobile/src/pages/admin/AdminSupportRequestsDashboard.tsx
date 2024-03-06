/**
 * mobile/src/pages/admin/AdminSupportRequestsDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../../util/PopupManager";
import { useEffect } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import { Grid, useDisclosure, VStack } from "@chakra-ui/react";
import MobileBox from "../../components/MobileBox";
import AdminSupportRequestModal from "../../components/AdminSupportRequestModal";
import { $$ } from "../../translations/i18n";

export default function AdminSupportRequestsDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [page, setPage] = React.useState(0);
  const [pages, setPages] = React.useState(0);
  const [requests, setRequests] = React.useState<
    {
      _id: string;
      email: string;
      category: string;
      additionalData: string;
      message: string;
      createdAt: string;
      processed: boolean;
      __v: number;
    }[]
  >([]);

  const [currentRequest, setCurrentRequest] = React.useState<
    (typeof requests)[0]
  >({
    _id: "",
    email: "",
    category: "",
    additionalData: "",
    message: "",
    createdAt: "",
    processed: false,
    __v: 0,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadPage = async (p: number) => {
    const res = await REST.Admin.supportRequests(
      localStorage.getItem("token") as string,
      p,
    );

    if (res.status === 200) {
      setRequests(res.payload.entries);
      setPages(res.payload.pages);
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$("pages.admin.support.loading.error", res.payload.error),
      });
    }
  };

  useEffect(() => {
    loadPage(page);
  }, [page]);

  return (
    <>
      <Page title={$$("menu.support")} redGradient>
        <MobileBox bg={"#101010"}>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
          >
            {requests.map((req) => (
              <>
                <IonCard
                  onClick={() => {
                    setCurrentRequest(req);
                    onOpen();
                  }}
                >
                  <IonCardHeader>
                    <IonCardTitle>
                      {req.category === "REPORT-USER"
                        ? $$("pages.admin.support.category.user")
                        : req.category === "REPORT-POST"
                        ? $$("pages.admin.support.category.post")
                        : req.category === "REPORT-BUG"
                        ? $$("pages.admin.support.category.bug")
                        : req.category === "VIDEO-QUESTION"
                        ? $$("pages.admin.support.category.video")
                        : $$("pages.admin.support.category.other")}
                    </IonCardTitle>
                    <IonCardSubtitle>
                      {req.processed ? (
                        <IonText color={"success"}>
                          {$$("pages.admin.support.request.completed")}
                        </IonText>
                      ) : (
                        <IonText color={"danger"}>
                          {$$("pages.admin.support.request.open")}
                        </IonText>
                      )}
                      &nbsp;
                      {new Date(req.createdAt).toLocaleString()}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div>
                      {$$("pages.admin.support.request.by")} {req.email}
                    </div>
                  </IonCardContent>
                </IonCard>
              </>
            ))}
          </Grid>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {page > 0 ? (
              <IonButton
                color={"danger"}
                onClick={() => setPage(page - 1)}
                expand={"block"}
              >
                {$$("control.back")}
              </IonButton>
            ) : null}
            {page < pages - 1 ? (
              <IonButton
                color={"success"}
                onClick={() => setPage(page + 1)}
                expand={"block"}
              >
                {$$("control.next")}
              </IonButton>
            ) : null}
          </div>
        </MobileBox>
        <AdminSupportRequestModal
          request={currentRequest}
          onClose={onClose}
          isOpen={isOpen}
          reload={() => {
            loadPage(page);
          }}
        />
      </Page>
    </>
  );
}
