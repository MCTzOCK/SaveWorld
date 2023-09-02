/**
 * mobile/src/components/AdminCreateVideoModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.09.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonProgressBar,
  IonText,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { REST } from "@saveworld/api-js";
import { ENDPOINT } from "../env";
import { useEffect } from "react";

export default function AdminCreateVideoModal(props: {
  modal: React.RefObject<HTMLIonModalElement>;
  callback: () => void;
}) {
  const [categories, setCategories] = React.useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    REST.Content.categories().then((res) => {
      if (res.status === 200) {
        setCategories(res.payload as any);
      }
    });
  }, []);

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );

  const [videoFile, setVideoFile] = React.useState<File | null>(null);

  const [uploading, setUploading] = React.useState<boolean>(false);

  return (
    <>
      <IonModal
        ref={props.modal}
        initialBreakpoint={0.8}
        breakpoints={[0, 0.8, 1]}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot={"start"}>
              <IonButton
                color={"danger"}
                onClick={() => {
                  props.modal.current?.dismiss();
                }}
                disabled={uploading}
              >
                Abbrechen
              </IonButton>
            </IonButtons>
            <IonTitle>Neues Video</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton
                color={"success"}
                disabled={uploading}
                onClick={async () => {
                  if (!videoFile) {
                    alert("Bitte wähle ein Video aus.");
                    return;
                  }

                  if (selectedCategories.length < 1) {
                    alert("Bitte wähle mindestens eine Kategorie aus.");
                    return;
                  }

                  const name = (
                    document.getElementById(
                      "create-vid-name",
                    ) as HTMLIonInputElement
                  ).value as string;
                  const desc = (
                    document.getElementById(
                      "create-vid-desc",
                    ) as HTMLIonTextareaElement
                  ).value as string;

                  if (!name || !desc) {
                    alert("Bitte fülle alle Felder aus!");
                    return;
                  }

                  const data = new FormData();
                  data.append("title", name);
                  data.append("description", desc);
                  data.append("categories", JSON.stringify(selectedCategories));
                  data.append("video", videoFile);

                  setUploading(true);

                  const res = await fetch(
                    ENDPOINT + "/admin/content/videos/create",
                    {
                      method: "POST",
                      body: data,
                      headers: {
                        "X-AUTH": localStorage.getItem("token") as string,
                      },
                    },
                  );

                  setUploading(false);
                  setVideoFile(null);
                  setSelectedCategories([]);
                  if (res.ok) {
                    props.callback();
                    props.modal.current?.dismiss();
                  } else {
                    let x = await res.json();
                    alert(
                      "Fehler beim Hochladen des Videos: " + x.payload.error,
                    );
                    props.modal.current?.dismiss();
                  }
                }}
              >
                <b>Fertig</b>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {uploading && (
            <>
              <IonProgressBar type={"indeterminate"} />
            </>
          )}
          {!uploading && (
            <>
              <div className={"ion-padding"}>
                <IonButton
                  expand={"block"}
                  onClick={async () => {
                    const a = document.createElement("input");
                    a.type = "file";
                    a.accept = "video/mp4";
                    a.onchange = (ev) => {
                      let t = ev.target as HTMLInputElement;
                      if (t.files?.length) {
                        setVideoFile(t.files[0]);
                      }
                    };
                    a.click();
                  }}
                  color={"success"}
                >
                  Video auswählen
                </IonButton>
                <IonText>
                  {videoFile ? videoFile.name : "Kein Video ausgewählt"}
                </IonText>
              </div>
              <IonList inset>
                <IonItem color={"light"}>
                  <IonInput
                    placeholder={"Name"}
                    label={"Name"}
                    labelPlacement={"fixed"}
                    id={"create-vid-name"}
                  />
                </IonItem>
                <IonItem color={"light"}>
                  <IonTextarea
                    placeholder={"Beschreibung"}
                    label={"Beschreibung"}
                    labelPlacement={"fixed"}
                    autoGrow
                    id={"create-vid-desc"}
                  />
                </IonItem>
                {categories.map((c) => {
                  return (
                    <>
                      <IonItem color={"light"}>
                        <IonToggle
                          slot={"end"}
                          onIonChange={(ev) => {
                            if (ev.detail.checked) {
                              setSelectedCategories([
                                ...selectedCategories,
                                c._id,
                              ]);
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter((sc) => sc !== c._id),
                              );
                            }
                          }}
                        />
                        <IonText>{c.name}</IonText>
                      </IonItem>
                    </>
                  );
                })}
              </IonList>
            </>
          )}
        </IonContent>
      </IonModal>
    </>
  );
}
