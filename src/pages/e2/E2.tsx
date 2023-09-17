/**
 * mobile/src/pages/e2/E2.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.09.2023
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { REST } from "@saveworld/api-js";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonProgressBar,
  IonText,
} from "@ionic/react";
import E2SubmitModal from "../../components/E2SubmitModal";

export default function E2() {
  useRedirectForAnon();

  const [templates, setTemplates] = useState<
    {
      _id: string;
      name: string;
      goal: string;
    }[]
  >([]);
  const [lifestyle, setLifestyle] = useState<{
    actions: {
      template: string;
      currentPerWeek: number;
    }[];
    goals: {
      template: string;
      goalPerWeek: number;
    }[];
  }>();

  const [hasSummaryForDay, setHasSummaryForDay] = useState<boolean>(false);
  const [summary, setSummary] = useState<{
    user: string;
    date: string;
    goals: {
      template: string;
      perDay: number;
    }[];
  }>();

  const [date, setDate] = useState(new Date().toISOString());
  const modal = React.useRef<HTMLIonModalElement>(null);

  const [weekly, setWeekly] = useState<{
    [key: string]: {
      goal: number;
      actual: number;
    };
  }>({});

  const loadBaseData = async () => {
    const tplRes = await REST.Lifestyle.templates();

    if (tplRes.status === 200) {
      setTemplates(tplRes.payload.lst);
    } else {
      alert("Vorlange konnten nicht geladen werden!");
      return;
    }

    const lfRes = await REST.Lifestyle.my(
      localStorage.getItem("token") as string,
    );

    if (lfRes.status === 200) {
      setLifestyle(lfRes.payload.lifestyle);
    } else {
      alert("Lifestyle konnte nicht geladen werden!");
      return;
    }

    const wRes = await REST.Lifestyle.weekly(
      localStorage.getItem("token") as string,
    );

    if (wRes.status === 200) {
      setWeekly(wRes.payload.goals);
    } else {
      alert("Wöchentliche Ziele konnten nicht geladen werden!");
      return;
    }
  };

  const loadSummary = async (d: string) => {
    const res = await REST.Lifestyle.summary(
      localStorage.getItem("token") as string,
      d,
    );

    if (res.status === 200) {
      setHasSummaryForDay(true);
      setSummary(res.payload.data);
    } else {
      setHasSummaryForDay(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadBaseData();
      await loadSummary(new Date().toISOString());
    })();
  }, []);

  return (
    <>
      <Page title={"Tracker"}>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Deine Woche</IonCardTitle>
            <IonCardSubtitle>
              {new Date(
                new Date().setDate(new Date().getDate() - 7),
              ).toLocaleDateString()}
              &nbsp;-&nbsp;
              {new Date().toLocaleDateString()}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {weekly &&
              Object.keys(weekly).map((k) => {
                return (
                  <>
                    <IonText>
                      {templates.find((t) => t._id === k)?.name}
                    </IonText>
                    <IonProgressBar
                      value={Math.max(weekly[k].actual, weekly[k].goal)}
                      color={
                        weekly[k].actual > weekly[k].goal ? "danger" : "success"
                      }
                    />
                    <IonText>
                      <small>
                        {weekly[k].actual} von {weekly[k].goal} erreicht.&nbsp;
                        {weekly[k].actual > weekly[k].goal ? (
                          <>
                            <IonText color={"danger"}>
                              Ziel nicht erreicht!
                            </IonText>
                          </>
                        ) : null}
                      </small>
                    </IonText>
                  </>
                );
              })}
          </IonCardContent>
        </IonCard>

        <IonDatetimeButton
          datetime={"datetime"}
          style={{
            marginBottom: "2rem",
          }}
        />
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
            onIonChange={(e) => {
              loadSummary(e.detail.value as string);
              setDate(e.detail.value! as string);
            }}
          ></IonDatetime>
        </IonModal>
        {hasSummaryForDay ? (
          <>
            <IonAccordionGroup>
              <IonAccordion value="first">
                <IonItem slot="header" color="light">
                  <IonLabel>Zusammenfassung von heute</IonLabel>
                </IonItem>
                <div slot="content">
                  <IonList inset>
                    {summary &&
                      summary.goals &&
                      summary.goals.map((g) => {
                        return (
                          <>
                            <IonItem color={"light"}>
                              <IonLabel>
                                <b>
                                  {
                                    templates.find((t) => t._id === g.template)
                                      ?.name
                                  }
                                </b>
                                <br />
                                <small>{g.perDay}x heute</small>
                              </IonLabel>
                            </IonItem>
                          </>
                        );
                      })}
                  </IonList>
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </>
        ) : (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Keine Daten</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Für diesen Tag hast du keine Daten eingetragen!
                {
                  // check if date is today
                  new Date(date).toDateString() ===
                  new Date().toDateString() ? (
                    <>
                      <IonButton
                        color={"success"}
                        expand={"block"}
                        style={{
                          marginTop: "1.2rem",
                        }}
                        onClick={() => {
                          modal.current?.present();
                        }}
                      >
                        Daten eintragen
                      </IonButton>
                    </>
                  ) : (
                    <>
                      <br />
                      Da das Datum in der Vergangenheit liegt, kannst du keine
                      Daten mehr eintragen.
                    </>
                  )
                }
              </IonCardContent>
            </IonCard>
          </>
        )}
        <E2SubmitModal
          modal={modal}
          templates={templates}
          lifestyle={lifestyle}
          loadSummary={loadSummary}
        />
      </Page>
    </>
  );
}
