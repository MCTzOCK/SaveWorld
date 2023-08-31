/**
 * mobile/src/components/AdminCreateCategoryModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.08.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { ENDPOINT } from "../env";
import { REST } from "@saveworld/api-js";
import { useEffect } from "react";

export default function AdminCreateCategoryModal(props: {
  modal: React.RefObject<HTMLIonModalElement>;
  callback: (name: string, description: string, image: string) => void;
}) {
  const [image, setImage] = React.useState<string>("");

  return (
    <>
      <IonModal
        ref={props.modal}
        initialBreakpoint={0.6}
        breakpoints={[0, 0.6, 1]}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot={"start"}>
              <IonButton
                color={"danger"}
                onClick={() => {
                  setImage("");
                  props.modal.current?.dismiss();
                }}
              >
                Abbrechen
              </IonButton>
            </IonButtons>
            <IonTitle>Neue Kategorie</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton
                color={"success"}
                onClick={async () => {
                  const name = (
                    document.getElementById(
                      "create-category-name",
                    ) as HTMLIonInputElement
                  ).value as string;
                  const desc = (
                    document.getElementById(
                      "create-category-desc",
                    ) as HTMLIonTextareaElement
                  ).value as string;

                  if (!name || !desc || image.length < 1) {
                    alert("Bitte fülle alle Felder aus!");
                    return;
                  }

                  REST.Admin.createCategory(
                    localStorage.getItem("token") as string,
                    name,
                    desc,
                    image,
                  ).then(async (res) => {
                    if (res.status === 200) {
                      props.callback(name, desc, image);
                      props.modal.current?.dismiss();
                    } else {
                      alert("Fehler beim Erstellen der Kategorie!");
                    }
                  });
                }}
              >
                <b>Fertig</b>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className={"ion-padding"}>
            <img src={image} />
            <IonButton
              expand={"block"}
              onClick={async () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const formData = new FormData();
                      formData.append("file", file);
                      fetch(ENDPOINT + "/media/upload", {
                        method: "POST",
                        body: formData,
                      }).then((res) => {
                        if (res.status === 200) {
                          res.json().then((res) => {
                            setImage(ENDPOINT + res.data.url);
                          });
                        } else {
                          alert("Fehler beim Upload: " + res.status);
                        }
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                };

                input.click();
              }}
              color={"success"}
            >
              Bild ändern
            </IonButton>
          </div>
          <IonList inset>
            <IonItem color={"light"}>
              <IonInput
                placeholder={"Name"}
                label={"Name"}
                labelPlacement={"fixed"}
                id={"create-category-name"}
              />
            </IonItem>
            <IonItem color={"light"}>
              <IonTextarea
                placeholder={"Beschreibung"}
                label={"Beschreibung"}
                labelPlacement={"fixed"}
                autoGrow
                id={"create-category-desc"}
              />
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
}
