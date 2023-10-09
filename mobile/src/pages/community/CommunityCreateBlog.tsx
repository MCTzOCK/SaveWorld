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
  IonButton,
  IonIcon,
  IonInput,
  IonText,
  useIonRouter,
} from "@ionic/react";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { send, sendSharp } from "ionicons/icons";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";

export default function CommunityCreateBlog() {
  useRedirectForAnon();

  const [v, setV] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [tags, setTags] = React.useState<string>("");
  const router = useIonRouter();

  return (
    <>
      <Page title={"Neuer Blog"}>
        <IonText>
          <p>
            Hier kannst du einen neuen Blog eintrag erstellen. Du kannst von
            deinen Bemühungen im Bezug auf ein umweltbewussteres Leben
            berichten, oder auch einfach nur deine Gedanken mit der Community
            teilen.
          </p>
        </IonText>
        <IonText>
          <p>
            <b>TIPP</b>: verwende @Benutzername um andere Benutzer zu markieren.
            Hierdurch erhalten diese eine Benachrichtigung und andere Benutzer
            können auf deren Profil gelangen!
          </p>
        </IonText>
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
        <SimpleMdeReact
          options={{
            theme: "dark",
            spellChecker: false,
            status: false,
            toolbar: [
              "bold",
              "italic",
              "heading",
              "|",
              "quote",
              "unordered-list",
              "ordered-list",
              "|",
              "link",
              "|",
              "preview",
            ],
          }}
          value={v}
          onInput={(v1) => setV((v1.target as any).value as string)}
        />
        <IonButton
          expand={"block"}
          color={"success"}
          onClick={async () => {
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
          <IonIcon slot={"start"} ios={send} md={sendSharp} />
          <IonText>Veröffentlichen</IonText>
        </IonButton>
      </Page>
    </>
  );
}
