/**
 * mobile/src/pages/community/CommunityCreateBlog.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonText,
  useIonRouter,
} from "@ionic/react";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {
  accessibilityOutline,
  informationCircle,
  send,
  sendSharp,
} from "ionicons/icons";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";
import MDEditor from "@uiw/react-md-editor";
import MobileBox from "../../components/MobileBox";
import { Button } from "@chakra-ui/react";

export default function CommunityCreateBlog() {
  useRedirectForAnon();

  const [v, setV] = React.useState<string | undefined>("");
  const [title, setTitle] = React.useState<string>("");
  const [tags, setTags] = React.useState<string>("");
  const router = useIonRouter();

  const [preview, setPreview] = React.useState<boolean>(false);

  return (
    <>
      <Page title={"Neuer Blog"}>
        <MobileBox>
          <IonAccordionGroup
            style={{
              borderRadius: "var(--chakra-radii-lg)",
            }}
          >
            <IonAccordion
              value={"information"}
              style={{
                borderRadius: "var(--chakra-radii-lg)",
              }}
            >
              <IonItem slot="header" color="light">
                <IonLabel>Informationen (klicken)</IonLabel>
                <IonIcon slot="end" icon={informationCircle} />
              </IonItem>
              <div className="ion-padding" slot="content">
                <IonText>
                  <p>
                    Hier kannst du einen neuen Blog eintrag erstellen. Du kannst
                    von deinen Bemühungen im Bezug auf ein umweltbewussteres
                    Leben berichten, oder auch einfach nur deine Gedanken mit
                    der Community teilen.
                  </p>
                </IonText>
                <IonText>
                  <p>
                    Blogs werden mit Markdown geschrieben. Markdown ist eine
                    einfache Auszeichnungssprache, die es dir ermöglicht, deinen
                    Text zu formatieren. Falls du noch nie mit Markdown
                    gearbeitet hast, kannst du dir{" "}
                    <a
                      onClick={() => {
                        router.push("/resources/md-help", "none", "replace");
                      }}
                      style={{
                        color: "var(--ion-color-success)",
                        fontWeight: 900,
                      }}
                    >
                      hier
                    </a>{" "}
                    eine Übersicht über die wichtigsten Befehle verschaffen.
                  </p>
                </IonText>
                <IonText>
                  <p>
                    <b style={{ color: "var(--ion-color-success)" }}>TIPP</b>:
                    verwende @Benutzername um andere Benutzer zu markieren.
                    Hierdurch erhalten diese eine Benachrichtigung und andere
                    Benutzer können auf deren Profil gelangen!
                  </p>
                </IonText>
              </div>
            </IonAccordion>
          </IonAccordionGroup>
          <IonInput
            labelPlacement={"fixed"}
            label={"Titel"}
            placeholder={"Gib deinem Blog einen Titel"}
            type={"text"}
            onIonInput={(e) => setTitle(e.detail.value!)}
          />
          <IonInput
            labelPlacement={"fixed"}
            label={"Tags"}
            placeholder={"Tags (durch Komma getrennt)"}
            type={"text"}
            onIonInput={(e) => setTags(e.detail.value!)}
          />
          <IonSegment
            value={preview ? "preview" : "edit"}
            style={{
              marginBottom: "1rem",
              marginTop: ".75rem",
            }}
          >
            <IonSegmentButton
              onClick={() => {
                setPreview(false);
              }}
              value={"edit"}
            >
              Bearbeiten
            </IonSegmentButton>
            <IonSegmentButton
              onClick={() => {
                setPreview(true);
              }}
              value={"preview"}
            >
              Vorschau
            </IonSegmentButton>
          </IonSegment>
          <MDEditor
            value={v}
            onChange={setV}
            hideToolbar={true}
            preview={preview ? "preview" : "edit"}
            style={{
              backgroundColor: "var(--ion-color-light)",
              color: "#fff",
              borderRadius: "10px",
            }}
          ></MDEditor>
          <Button
            w={"100%"}
            color={"brand.500"}
            mt={2}
            onClick={async () => {
              if (!v) return;

              if (v.length < 10) {
                PopupManager.alert({
                  title: "Fehler",
                  description: "Bitte gib mehr als 10 Zeichen ein.",
                });
                return;
              }

              if (!title) {
                PopupManager.alert({
                  title: "Fehler",
                  description: "Bitte gib einen Titel ein.",
                });
                return;
              }

              const res = await REST.Community.createBlogEntry(
                localStorage.getItem("token") as string,
                title,
                v,
                tags.split(","),
              );

              if (res.status === 200) {
                router.push(
                  "/community/r/" + res.payload.entry._id,
                  "forward",
                  "replace",
                );
              } else {
                PopupManager.alert({
                  title: "Fehler",
                  description:
                    "Es ist ein Fehler aufgetreten: " + res.payload.error,
                });
              }
            }}
          >
            Veröffentlichen
          </Button>
        </MobileBox>
      </Page>
    </>
  );
}
