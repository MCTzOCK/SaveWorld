/**
 * mobile/src/components/TrackerActionModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.09.2023
 *
 */

import * as React from "react";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { REST } from "@saveworld/api-js";
import {
  information,
  informationCircle,
  informationCircleSharp,
  informationSharp,
} from "ionicons/icons";

const templates: {
  action: string;
  description: string;
}[] = [
  {
    action: "Kein Fleisch essen",
    description: "Ich habe heute kein Fleisch gegessen.",
  },
];

export default function TrackerActionModal(props: {
  modal: React.RefObject<HTMLIonModalElement>;
  action?: {
    __v: number;
    _id: string;
    action: string;
    date: string; // YYYY-MM-DD
    description: string;
    user: string;
  };
  reload: () => void;
  date: string;
  setAction: (a: any) => void;
}) {
  return (
    <>
      <IonModal
        ref={props.modal}
        initialBreakpoint={0.7}
        breakpoints={[0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot={"start"}>
              <IonButton
                color={"danger"}
                onClick={() => {
                  props.setAction(undefined);
                  props.modal.current?.dismiss();
                }}
              >
                Abbrechen
              </IonButton>
            </IonButtons>
            <IonTitle>{props.action ? "Bearbeiten" : "Neue Aktion"}</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton color={"warning"} id={"disclaimer-click"}>
                <IonIcon ios={informationCircle} md={informationCircleSharp} />
              </IonButton>
              <IonPopover trigger={"disclaimer-click"} triggerAction={"click"}>
                <IonContent className={"ion-padding"}>
                  <IonText>
                    Wir können nicht überprüfen, ob du die Aktionen wirklich
                    durchgeführt, aber wir vertrauen auf deine Ehrlichkeit!
                  </IonText>
                </IonContent>
              </IonPopover>
              <IonButton
                color={"success"}
                onClick={async () => {
                  let action = (
                    document.getElementById(
                      "tracker-ca-action",
                    ) as HTMLIonInputElement
                  ).value as string;
                  let desc = (
                    document.getElementById(
                      "tracker-ca-description",
                    ) as HTMLIonTextareaElement
                  ).value as string;

                  if (!action || !desc) {
                    alert("Bitte fülle alle Felder aus!");
                    return;
                  }

                  if (props.action) {
                    const res = await REST.Tracker.updateAction(
                      localStorage.getItem("token") as string,
                      props.action._id,
                      action,
                      desc,
                      props.date,
                    );

                    if (res.status === 200) {
                      props.reload();
                      props.modal.current?.dismiss();
                      props.setAction(undefined);
                    } else {
                      alert(
                        "Fehler beim Erstellen der Aktion: " +
                          res.payload.error,
                      );
                    }
                  } else {
                    const res = await REST.Tracker.createAction(
                      localStorage.getItem("token") as string,
                      action,
                      desc,
                      props.date,
                    );

                    if (res.status === 200) {
                      props.reload();
                      props.modal.current?.dismiss();
                    } else {
                      alert(
                        "Fehler beim Erstellen der Aktion: " +
                          res.payload.error,
                      );
                    }
                  }
                }}
              >
                <b>Fertig</b>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList inset>
            <IonItem color={"light"}>
              <IonInput
                label={"Aktion"}
                labelPlacement={"fixed"}
                value={props.action?.action}
                placeholder={"Aktion"}
                id={"tracker-ca-action"}
              />
            </IonItem>
            <IonItem color={"light"}>
              <IonTextarea
                label={"Beschreibung"}
                labelPlacement={"fixed"}
                value={props.action?.description}
                placeholder={"Beschreibung"}
                id={"tracker-ca-description"}
                autoGrow
              />
            </IonItem>
          </IonList>
          {!props.action && (
            <>
              <IonText color={"medium"}>
                <IonAccordionGroup>
                  <IonAccordion value={"templates"}>
                    <IonItem slot={"header"} color={"light"}>
                      <IonLabel>Starte mit einer Vorlage</IonLabel>
                    </IonItem>
                    <div className={"ion-padding"} slot={"content"}>
                      <IonList
                        style={{
                          borderRadius: "10px",
                        }}
                      >
                        {templates.map((t) => {
                          return (
                            <>
                              <IonItem
                                color={"light"}
                                onClick={() => {
                                  (
                                    document.getElementById(
                                      "tracker-ca-action",
                                    ) as HTMLIonInputElement
                                  ).value = t.action;
                                  (
                                    document.getElementById(
                                      "tracker-ca-description",
                                    ) as HTMLIonTextareaElement
                                  ).value = t.description;
                                }}
                              >
                                <IonLabel className={"ion-text-wrap"}>
                                  <h2>{t.action}</h2>
                                  {t.description}
                                </IonLabel>
                              </IonItem>
                            </>
                          );
                        })}
                      </IonList>
                    </div>
                  </IonAccordion>
                </IonAccordionGroup>
              </IonText>
            </>
          )}
        </IonContent>
      </IonModal>
    </>
  );
}
