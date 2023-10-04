/**
 * mobile/src/pages/admin/AdminLifestyleTemplates.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import {
  IonActionSheet,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonRow,
  IonSearchbar,
} from "@ionic/react";
import {
  add,
  addSharp,
  pencil,
  pencilSharp,
  trash,
  trashSharp,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";

export default function AdminLifestyleTemplates() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [templates, setTemplates] = useState<
    {
      name: string;
      goal: string;
    }[]
  >([]);

  const reload = async () => {
    setQuery("");
    const tplR = await REST.Lifestyle.templates();
    if (tplR.status === 200) {
      setTemplates(tplR.payload.lst);
    } else {
      PopupManager.alert({
        title: "Fehler",
        description: "Fehler beim Laden der Vorlagen: " + tplR.payload.error,
      });
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const [query, setQuery] = useState<string>("");

  return (
    <>
      <Page title={"Lifestyle"} redGradient>
        <IonSearchbar
          placeholder={"Suche"}
          value={query}
          onIonInput={(ev) => {
            setQuery((ev.detail.value || "").trim());
          }}
        />

        {templates && (
          <div>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <b>Name</b>
                </IonCol>
                <IonCol>
                  <b>Ziel</b>
                </IonCol>
              </IonRow>
              {templates
                .filter((tpl) => {
                  if (query === "") return true;
                  return (
                    tpl.name.toLowerCase().includes(query.toLowerCase()) ||
                    tpl.goal.toLowerCase().includes(query.toLowerCase())
                  );
                })
                .map((tpl) => {
                  return (
                    <>
                      {
                        //@ts-ignore
                      }
                      <IonRow id={"open-as-" + (tpl as any)._id}>
                        <IonCol>{tpl.name}</IonCol>
                        <IonCol>{tpl.goal}</IonCol>
                      </IonRow>
                      <IonActionSheet
                        trigger={"open-as-" + (tpl as any)._id}
                        header={tpl.name}
                        onIonActionSheetDidDismiss={async (ev) => {
                          switch (ev.detail.data.action) {
                            case "delete":
                              if (
                                !(await PopupManager.confirmAsync({
                                  title: "Löschen",
                                  question:
                                    "Möchtest du die Vorlage wirklich löschen?",
                                }))
                              )
                                return;
                              const delR =
                                await REST.Admin.deleteLifestyleTemplate(
                                  localStorage.getItem("token") as string,
                                  (tpl as any)._id,
                                );
                              if (delR.status === 200) {
                                await reload();
                              } else {
                                PopupManager.alert({
                                  title: "Fehler",
                                  description:
                                    "Fehler beim Löschen der Vorlage: " +
                                    delR.payload.error,
                                });
                              }
                              break;
                            case "edit":
                              const name = await PopupManager.promptAsync({
                                title: "Name der Vorlage",
                                helperText: "Name der Vorlage",
                                inputType: "INPUT",
                              });

                              const goal = await PopupManager.promptAsync({
                                title: "Ziel der Vorlage",
                                helperText: "Ziel der Vorlage",
                                inputType: "INPUT",
                              });
                              if (name && goal) {
                                const tplR =
                                  await REST.Admin.updateLifestyleTemplate(
                                    localStorage.getItem("token") as string,
                                    (tpl as any)._id,
                                    name,
                                    goal,
                                  );
                                if (tplR.status === 200) {
                                  await reload();
                                } else {
                                  PopupManager.alert({
                                    title: "Fehler",
                                    description:
                                      "Fehler beim Bearbeiten der Vorlage: " +
                                      tplR.payload.error,
                                  });
                                }
                              }
                              break;
                            default:
                              break;
                          }
                        }}
                        buttons={[
                          {
                            text: "Löschen",
                            role: "destructive",
                            data: {
                              action: "delete",
                            },
                          },
                          {
                            text: "Bearbeiten",
                            data: {
                              action: "edit",
                            },
                          },
                          {
                            text: "Abbrechen",
                            role: "cancel",
                            data: {
                              action: "cancel",
                            },
                          },
                        ]}
                      ></IonActionSheet>
                    </>
                  );
                })}
            </IonGrid>
          </div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color={"danger"}
            onClick={async () => {
              const name = await PopupManager.promptAsync({
                title: "Name der Vorlage",
                helperText: "Name der Vorlage",
                inputType: "INPUT",
              });

              const goal = await PopupManager.promptAsync({
                title: "Ziel der Vorlage",
                helperText: "Ziel der Vorlage",
                inputType: "INPUT",
              });

              if (name && goal) {
                const tplR = await REST.Admin.createLifestyleTemplate(
                  localStorage.getItem("token") as string,
                  name,
                  goal,
                );
                if (tplR.status === 200) {
                  await reload();
                } else {
                  PopupManager.alert({
                    title: "Fehler",
                    description:
                      "Fehler beim Erstellen der Vorlage: " +
                      tplR.payload.error,
                  });
                }
              }
            }}
          >
            <IonIcon ios={add} md={addSharp} />
          </IonFabButton>
        </IonFab>
      </Page>
    </>
  );
}
