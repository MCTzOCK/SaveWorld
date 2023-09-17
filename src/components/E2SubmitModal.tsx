/**
 * mobile/src/components/E2SubmitModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.09.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Share } from "@capacitor/share";
import {
  add,
  addSharp,
  remove,
  removeSharp,
  share,
  shareSharp,
  star,
  starSharp,
} from "ionicons/icons";
import { useState } from "react";
import { REST } from "@saveworld/api-js";

export default function E2SubmitModal(props: {
  modal: React.RefObject<HTMLIonModalElement>;
  templates: {
    _id: string;
    name: string;
    goal: string;
  }[];
  lifestyle?: {
    actions: {
      template: string;
      currentPerWeek: number;
    }[];
    goals: {
      template: string;
      goalPerWeek: number;
    }[];
  };
  loadSummary: (d: string) => void;
}) {
  const [state, setState] = useState<{
    [key: string]: number;
  }>({});

  React.useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <>
      <IonModal
        ref={props.modal}
        initialBreakpoint={0.75}
        breakpoints={[0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot={"start"}>
              <IonButton
                color={"danger"}
                onClick={async () => {
                  props.modal.current?.dismiss();
                }}
              >
                Abbrechen
              </IonButton>
            </IonButtons>
            <IonTitle>Wie war dein Tag?</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton
                color={"success"}
                onClick={async () => {
                  const res = await REST.Lifestyle.submit(
                    localStorage.getItem("token") as string,
                    Object.keys(state).map((k) => {
                      return {
                        template: k,
                        perDay: state[k],
                      };
                    }),
                  );

                  if (res.status === 200) {
                    props.loadSummary(new Date().toISOString());
                    props.modal.current?.dismiss();
                  } else {
                    alert("Fehler: " + res.payload.error);
                  }
                }}
              >
                <b>Speichern</b>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div
            style={{
              padding: "1rem",
              textAlign: "center",
            }}
          >
            Wie war dein Tag? Trage ein, wie oft du die folgenden Aktionen
            durchgeführt hast.
          </div>
          <IonList inset>
            {props.lifestyle &&
              props.lifestyle.actions.map((t) => {
                return (
                  <>
                    <IonItem color={"light"}>
                      <IonText
                        style={{
                          padding: "10px",
                          marginRight: "2rem",
                        }}
                      >
                        {props.templates.find((x) => x._id === t.template)
                          ? props.templates.find((x) => x._id === t.template)!
                              .name
                          : "Unbekannte Aktion"}
                      </IonText>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <IonButton
                          color={"danger"}
                          onClick={() => {
                            if (state[t.template] > 0) {
                              setState({
                                ...state,
                                [t.template]: state[t.template]
                                  ? state[t.template] - 1
                                  : 0,
                              });
                            }
                          }}
                        >
                          <IonIcon ios={remove} md={removeSharp} />
                        </IonButton>
                        <IonText>
                          {state[t.template] ? state[t.template] : 0}
                        </IonText>
                        <IonButton
                          color={"success"}
                          onClick={() => {
                            setState({
                              ...state,
                              [t.template]: state[t.template]
                                ? state[t.template] + 1
                                : 1,
                            });
                          }}
                        >
                          <IonIcon ios={add} md={addSharp} />
                        </IonButton>
                      </div>
                    </IonItem>
                  </>
                );
              })}
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
}
