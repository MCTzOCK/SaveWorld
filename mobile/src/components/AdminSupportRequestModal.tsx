/**
 * mobile/src/components/AdminSupportRequestModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.12.2023
 *
 */

import * as React from "react";
import SaveWorldModal from "./SaveWorldModal";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import PopupManager from "../util/PopupManager";
import { REST } from "@saveworld/api-js";

export default function AdminSupportRequestModal(props: {
  request: {
    _id: string;
    email: string;
    category: string;
    additionalData: string;
    message: string;
    createdAt: string;
    processed: boolean;
    __v: number;
  };
  onClose: () => void;
  isOpen: boolean;
  reload: () => void;
}) {
  return (
    <>
      <SaveWorldModal
        title={
          props.request.category === "REPORT-USER"
            ? "Benutzer Meldung"
            : props.request.category === "REPORT-POST"
            ? "Beitrag Meldung"
            : props.request.category === "REPORT-BUG"
            ? "Bug Meldung"
            : "Anderes"
        }
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        {props.request && (
          <>
            {props.request.processed && (
              <>
                <Alert status={"success"} borderRadius={"md"}>
                  <AlertIcon />
                  <AlertDescription>
                    Diese Anfrage ist bereits abgeschlossen
                  </AlertDescription>
                </Alert>
              </>
            )}
            <Text fontSize={"lg"} mt={4}>
              Diese Support-Anfrage wurde am{" "}
              {new Date(props.request.createdAt).toLocaleDateString()} um&nbsp;
              {new Date(props.request.createdAt).toLocaleTimeString()} Uhr von{" "}
              {props.request.email} erstellt.
              <br />
              <br />
              Der Benutzer hat folgende Nachricht hinterlassen:
              <br />
              <pre>{props.request.message}</pre>
            </Text>
            <ButtonGroup w={"100%"} mt={4}>
              <Button
                w={"100%"}
                color={"brand.500"}
                onClick={() => {
                  if (props.request.category === "REPORT-USER") {
                    window.location.href =
                      "/community/u/" + props.request.additionalData;
                  } else if (props.request.category === "REPORT-POST") {
                    window.location.href =
                      "/community/r/" + props.request.additionalData;
                  }
                }}
                display={
                  !(
                    props.request.category === "REPORT-USER" ||
                    props.request.category === "REPORT-POST"
                  )
                    ? "none"
                    : "initial"
                }
                isDisabled={props.request.processed}
              >
                {props.request.category === "REPORT-USER"
                  ? "Profil"
                  : "Beitrag"}
              </Button>
              <Button
                w={"100%"}
                color={"brand.500"}
                isDisabled={props.request.processed}
                onClick={async () => {
                  if (
                    props.request.category === "GENERAL" ||
                    props.request.category === "REPORT-BUG" ||
                    props.request.category === "VIDEO-QUESTION"
                  ) {
                    const message = await PopupManager.promptAsync({
                      title: "Antwort",
                      helperText: "Beantworte die Anfrage des Benutzers",
                      inputType: "TEXTAREA",
                    });

                    if (!message) return;

                    const res = await REST.Admin.processSupportRequest(
                      localStorage.getItem("token") as string,
                      props.request._id,
                      message,
                    );

                    if (res.status === 200) {
                      props.reload();
                      props.onClose();
                    } else {
                      PopupManager.alert({
                        title: "Fehler",
                        description:
                          "Fehler beim Abschließen der Anfrage: " +
                          res.payload.error,
                      });
                    }
                  } else if (props.request.category === "REPORT-POST") {
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
                        props.request.additionalData,
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
                      props.request._id,
                      message,
                    );

                    if (res.status === 200) {
                      props.reload();
                      props.onClose();
                    } else {
                      PopupManager.alert({
                        title: "Fehler",
                        description:
                          "Fehler beim Abschließen der Anfrage: " +
                          res.payload.error,
                      });
                    }
                  } else if (props.request.category === "REPORT-USER") {
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
                        props.request.additionalData,
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
                      props.request._id,
                      message,
                    );

                    if (res.status === 200) {
                      props.reload();
                      props.onClose();
                    } else {
                      PopupManager.alert({
                        title: "Fehler",
                        description:
                          "Fehler beim Abschließen der Anfrage: " +
                          res.payload.error,
                      });
                    }
                  }
                }}
              >
                Abschließen
              </Button>
            </ButtonGroup>
          </>
        )}
      </SaveWorldModal>
    </>
  );
}
