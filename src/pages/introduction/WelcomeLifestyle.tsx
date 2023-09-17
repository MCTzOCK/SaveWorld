/**
 * mobile/src/pages/introduction/WelcomeLifestyle.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { add, addSharp, remove, removeSharp } from "ionicons/icons";

export default function WelcomeLifestyle() {
  useRedirectForAnon();

  const [templates, setTemplates] = useState<
    {
      _id: string;
      name: string;
      goal: string;
    }[]
  >([]);

  const [state, setState] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    REST.Lifestyle.templates().then((res) => {
      setTemplates(res.payload.lst);
      let s: {
        [key: string]: number;
      } = {};
      for (const a of res.payload.lst) {
        s[a._id] = 0;
      }
      console.log(s);
      setState(s);
    });
  }, []);

  const router = useIonRouter();

  return (
    <>
      <Page title={"Lifestyle"}>
        <IonList inset>
          <IonText>
            Bitte trag hier Daten zu deinem Lebensstil ein, damit du dir Ziele
            setzen kannst, um diesen zu verbessern! In der linken Spalte siehst
            du die Aktion und in der rechten Spalte kannst du eintragen, wie oft
            du diese Aktion in der Woche normalerweise durchführst.
          </IonText>
        </IonList>
        <IonList inset>
          {templates.map((t) => {
            return (
              <>
                <IonItem color={"light"}>
                  <IonText
                    style={{
                      padding: "10px",
                      marginRight: "2rem",
                    }}
                  >
                    {t.name}
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
                        if (state[t._id] > 0) {
                          setState({
                            ...state,
                            [t._id]: state[t._id] - 1,
                          });
                        }
                      }}
                    >
                      <IonIcon ios={remove} md={removeSharp} />
                    </IonButton>
                    <IonText>{state[t._id]}</IonText>
                    <IonButton
                      color={"success"}
                      onClick={() => {
                        setState({
                          ...state,
                          [t._id]: state[t._id] + 1,
                        });
                      }}
                    >
                      <IonIcon ios={add} md={addSharp} />
                    </IonButton>
                  </div>
                </IonItem>
                {state[t._id] > 1 && (
                  <IonItem color={"light"}>
                    <IonText>
                      <b>Wöchentliches Ziel:</b> Diese Aktion&nbsp;
                      {Math.round(state[t._id] / 2)} vermeiden.
                    </IonText>
                  </IonItem>
                )}
              </>
            );
          })}
        </IonList>
        <IonButton
          color={"success"}
          expand={"block"}
          onClick={async () => {
            const actions = [];

            for (const a in state) {
              actions.push({
                template: a,
                currentPerWeek: state[a],
              });
            }

            const goals = [];

            for (const a in state) {
              goals.push({
                template: a,
                goalPerWeek: state[a] > 1 ? Math.round(state[a] / 2) : 0,
              });
            }

            const res = await REST.Lifestyle.update(
              localStorage.getItem("token") as string,
              actions,
              goals,
            );

            if (res.status !== 200) {
              alert(
                "Fehler beim Speichern des Lifestyles: " + res.payload.error,
              );
            } else {
              router.push("/welcome/finish", "forward", "replace");
            }
          }}
        >
          Speichern
        </IonButton>
      </Page>
    </>
  );
}
