/**
 * mobile/src/pages/tracker/EcoTracker.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.09.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import {
  IonDatetime,
  IonDatetimeButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
  IonText,
} from "@ionic/react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import {
  add,
  addSharp,
  pencil,
  pencilSharp,
  trash,
  trashSharp,
} from "ionicons/icons";
import TrackerActionModal from "../../components/TrackerActionModal";
import PopupManager from "../../util/PopupManager";

export default function EcoTracker() {
  useRedirectForAnon();

  const [dates, setDates] = useState<string[]>([]);

  const [date, setDate] = useState(new Date().toISOString());
  const [actions, setActions] = useState<
    {
      __v: number;
      _id: string;
      action: string;
      date: string; // YYYY-MM-DD
      description: string;
      user: string;
    }[]
  >([]);

  const reloadData = async (d?: string) => {
    const res = await REST.Tracker.actions(
      localStorage.getItem("token") as string,
      dx(new Date(d ? d : date)),
    );

    if (res.status === 200) {
      setActions(res.payload.data);
    } else {
      PopupManager.alert({
        title: "Fehler",
        description:
          "Aktionen konnten nicht geladen werden: " + res.payload.error,
      });
    }

    const dRes = await REST.Tracker.dates(
      localStorage.getItem("token") as string,
    );

    if (dRes.status === 200) {
      setDates(dRes.payload.data);
    } else {
      PopupManager.alert({
        title: "Fehler",
        description:
          "Daten konnten nicht geladen werden: " + dRes.payload.error,
      });
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const createModal = React.useRef<HTMLIonModalElement>(null);

  const [currentAction, setCurrentAction] = useState<{
    __v: number;
    _id: string;
    action: string;
    date: string; // YYYY-MM-DD
    description: string;
    user: string;
  } | null>(null);

  return (
    <>
      <Page title={"Tracker"}>
        <IonDatetimeButton datetime={"datetime"} />
        <IonModal keepContentsMounted>
          <IonDatetime
            id={"datetime"}
            firstDayOfWeek={1}
            locale={"de-DE"}
            presentation={"date"}
            value={date}
            doneText={"Fertig"}
            cancelText={"Abbrechen"}
            max={new Date().toISOString()}
            showDefaultButtons
            highlightedDates={dates.map((d) => {
              return {
                date: d,
                textColor: "#000000",
                backgroundColor: "var(--ion-color-success)",
              };
            })}
            onIonChange={(e) => {
              setDate(e.detail.value! as string);
              reloadData(e.detail.value! as string);
            }}
          ></IonDatetime>
        </IonModal>
        <IonList inset>
          {actions.map((a) => {
            return (
              <>
                <IonItemSliding>
                  <IonItem color={"light"}>
                    <IonLabel className={"ion-text-wrap"}>
                      <h2>{a.action}</h2>
                      {a.description}
                    </IonLabel>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption
                      color={"primary"}
                      onClick={() => {
                        setCurrentAction(a);
                        createModal.current?.present();
                      }}
                    >
                      <IonIcon slot="icon-only" ios={pencil} md={pencilSharp} />
                    </IonItemOption>
                    <IonItemOption
                      color={"danger"}
                      onClick={async () => {
                        if (
                          !confirm("Möchtest du diese Aktion wirklich löschen?")
                        )
                          return;

                        const res = await REST.Tracker.deleteAction(
                          localStorage.getItem("token") as string,
                          a._id,
                        );

                        if (res.status === 200) {
                          reloadData();
                        } else {
                          PopupManager.alert({
                            title: "Fehler",
                            description:
                              "Aktionen konnten nicht gelöscht werden: " +
                              res.payload.error,
                          });
                        }
                      }}
                    >
                      <IonIcon slot="icon-only" ios={trash} md={trashSharp} />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              </>
            );
          })}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color={"success"}
            onClick={() => {
              createModal.current?.present();
            }}
          >
            <IonIcon ios={add} md={addSharp} />
          </IonFabButton>
        </IonFab>
        <TrackerActionModal
          modal={createModal}
          reload={reloadData}
          date={dx(new Date(date))}
          action={currentAction || undefined}
          setAction={setCurrentAction}
        />
      </Page>
    </>
  );
}

const dx = (dt: Date) => {
  let year = dt.getFullYear();
  let month =
    dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
  let day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();

  return `${year}-${month}-${day}`;
};
