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
import { REST } from "@saveworld/api-js/index";
import { useEffect } from "react";
import PopupManager from "../util/PopupManager";
import { $$ } from "../translations/i18n";

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
                {$$("control.cancel")}
              </IonButton>
            </IonButtons>
            <IonTitle>{$$("components.admin.create.category")}</IonTitle>
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
                    PopupManager.alert({
                      title: $$("control.error"),
                      description: $$("form.incomplete"),
                    });
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
                      PopupManager.alert({
                        title: $$("control.error"),
                        description: $$(
                          "components.admin.create.category.error",
                          res.payload.error,
                        ),
                      });
                    }
                  });
                }}
              >
                <b>{$$("general.finished")}</b>
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
                          PopupManager.alert({
                            title: $$("control.error"),
                            description: $$(
                              "control.upload.error",
                              res.status.toString(),
                            ),
                          });
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
              {$$("components.admin.create.category.change.image")}
            </IonButton>
          </div>
          <IonList inset>
            <IonItem color={"light"}>
              <IonInput
                placeholder={$$("components.admin.create.category.name")}
                label={$$("components.admin.create.category.name")}
                labelPlacement={"fixed"}
                id={"create-category-name"}
              />
            </IonItem>
            <IonItem color={"light"}>
              <IonTextarea
                placeholder={$$("components.admin.create.category.description")}
                label={$$("components.admin.create.category.description")}
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
