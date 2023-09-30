/**
 * mobile/src/pages/Support.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import * as React from "react";
import Page from "../components/Page";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import { useUserData } from "../hooks/useUserData";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FaEnvelope, FaTag } from "react-icons/fa";
import { useEffect } from "react";
import PopupManager from "../util/PopupManager";
import { REST } from "@saveworld/api-js";

export default function Support() {
  const [category, setCategory] = React.useState<string>("GENERAL");
  const [email, setEmail] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [additional, setAdditional] = React.useState<string>("");

  const [reportContent, setReportContent] = React.useState<boolean>(false);

  const { userInfo, loggedIn } = useUserData();

  useEffect(() => {
    if (loggedIn) {
      setEmail(userInfo.email);
    }
  }, [userInfo, loggedIn]);

  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);

    if (usp.get("category") === "REPORT_USER") {
      if (usp.get("report_user")) {
        setCategory("REPORT-USER");
        setReportContent(true);
        setAdditional(usp.get("report_user") as string);
      }
    } else if (usp.get("category") === "REPORT_POST") {
      if (usp.get("report_post")) {
        setCategory("REPORT-POST");
        setReportContent(true);
        setAdditional(usp.get("report_post") as string);
      }
    }
  }, []);

  return (
    <>
      <Page title={"Support"}>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Anfrage</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <VStack spacing={"1rem"}>
              <InputGroup>
                <InputLeftAddon>
                  <FaEnvelope />
                </InputLeftAddon>
                <Input
                  placeholder={"E-Mail"}
                  disabled={loggedIn}
                  defaultValue={loggedIn ? userInfo.email : ""}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type={"email"}
                />
              </InputGroup>
              <Select
                placeholder={"Kategorie auswählen"}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                disabled={reportContent}
              >
                <option value={"GENERAL"}>Genereller Support</option>
                <option value={"REPORT-BUG"}>Fehler melden</option>
                {reportContent && (
                  <>
                    <option value={"REPORT-USER"}>Benutzer melden</option>
                    <option value={"REPORT-POST"}>Beitrag melden</option>
                  </>
                )}
              </Select>
              <Textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                placeholder={"Weitere Details"}
              />
              {additional && (
                <>
                  <IonText>
                    Deiner Anfrage werden die Details des zu meldenden Inhalts
                    automatisch hinzugefügt.
                  </IonText>
                </>
              )}
            </VStack>
            <IonButton
              color={"success"}
              expand={"block"}
              style={{
                marginTop: "1rem",
              }}
              onClick={async () => {
                if (!category) {
                  await PopupManager.alertAsync({
                    title: "Fehler",
                    description: "Bitte wähle eine Kategorie aus.",
                  });
                  return;
                }

                if (!message) {
                  await PopupManager.alertAsync({
                    title: "Fehler",
                    description: "Bitte gib eine Nachricht ein.",
                  });
                  return;
                }

                if (
                  !(await PopupManager.confirmAsync({
                    title: "Bestätigen",
                    question: "Möchtest du diese Anfrage wirklich absenden?",
                  }))
                )
                  return;

                const res = await REST.Support.submit(
                  email,
                  category,
                  message,
                  additional,
                );

                if (res.status === 200) {
                  await PopupManager.alertAsync({
                    title: "Abgeschlossen",
                    description: "Deine Anfrage wurde erfolgreich abgeschickt.",
                  });
                } else {
                  await PopupManager.alertAsync({
                    title: "Fehler",
                    description:
                      "Deine Anfrage konnte nicht abgeschickt werden: " +
                      res.payload.error,
                  });
                }
              }}
            >
              Absenden
            </IonButton>
          </IonCardContent>
        </IonCard>
      </Page>
    </>
  );
}
