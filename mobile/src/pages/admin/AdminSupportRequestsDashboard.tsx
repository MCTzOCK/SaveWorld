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
import { REST } from "@saveworld/api-js";
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
        title: "Fehler",
        description:
          "Fehler beim Laden der Supportanfragen: " + res.payload.error,
      });
    }
  };

  useEffect(() => {
    loadPage(page);
  }, [page]);

  return (
    <>
      <Page title={"Support"} redGradient>
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
                        ? "Benutzer Meldung"
                        : req.category === "REPORT-POST"
                        ? "Beitrag Meldung"
                        : req.category === "REPORT-BUG"
                        ? "Bug Meldung"
                        : req.category === "VIDEO-QUESTION"
                        ? "Video Frage"
                        : "Anderes"}
                    </IonCardTitle>
                    <IonCardSubtitle>
                      {req.processed ? (
                        <IonText color={"success"}>Bearbeitet</IonText>
                      ) : (
                        <IonText color={"danger"}>Offen</IonText>
                      )}
                      &nbsp;
                      {new Date(req.createdAt).toLocaleString()}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div>Anfrage von: {req.email}</div>
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
                Zurück
              </IonButton>
            ) : null}
            {page < pages - 1 ? (
              <IonButton
                color={"success"}
                onClick={() => setPage(page + 1)}
                expand={"block"}
              >
                Weiter
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
