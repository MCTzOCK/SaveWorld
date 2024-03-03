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
import PopupManager from "../../util/PopupManager";
import { Box, Flex } from "@chakra-ui/react";
import MobileBox from "../../components/MobileBox";
import { $$ } from "../../translations/i18n";
import { translateOnlineV3 } from "../../util/online-translate";

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
    REST.Lifestyle.templates().then(async (res) => {
      let tpls = res.payload.lst;
      if (window.language !== "de") {
        for (const t of tpls) {
          t.name = await translateOnlineV3({
            text: t.name,
            to: window.language,
          });
          t.goal = await translateOnlineV3({
            text: t.goal,
            to: window.language,
          });
        }
      }

      setTemplates(res.payload.lst);
      let s: {
        [key: string]: number;
      } = {};
      for (const a of res.payload.lst) {
        s[a._id] = 0;
      }
      setState(s);
    });
  }, []);

  const router = useIonRouter();

  return (
    <>
      <Page title={$$("menu.lifestyle")}>
        <MobileBox>
          <IonList
            inset
            style={{
              backgroundColor: "transparent",
            }}
          >
            <IonText>{$$("pages.introduction.lifestyle.description")}</IonText>
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
                        <b>{$$("pages.introduction.lifestyle.weekly.goal")}:</b>{" "}
                        {$$("pages.introduction.lifestyle.this.action")}&nbsp;
                        {Math.round(state[t._id] / 2)}{" "}
                        {$$("pages.introduction.lifestyle.avoid")}.
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
                if (state[a] === 0) continue;

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
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$(
                    "pages.introduction.lifestyle.save.error",
                    res.payload.error,
                  ),
                });
              } else {
                router.push("/welcome/finish", "forward", "push");
              }
            }}
          >
            {$$("control.save")}
          </IonButton>
        </MobileBox>
      </Page>
    </>
  );
}
