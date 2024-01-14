/**
 * mobile/src/components/E2Data.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.09.2023
 *
 */

import * as React from "react";
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
import E2SubmitModal from "./E2SubmitModal";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import ProgressBar from "@ramonak/react-progress-bar";
import PopupManager from "../util/PopupManager";
import { $$ } from "../translations/i18n";

export default function E2Data() {
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

  const [weeklyDates, setWeeklyDates] = useState<string[]>([]);

  const loadBaseData = async () => {
    const tplRes = await REST.Lifestyle.templates();

    if (tplRes.status === 200) {
      setTemplates(tplRes.payload.lst);
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$(
          "components.e2.lifestyle.templates.loading.error",
          tplRes.payload.error,
        ),
      });
      return;
    }

    const lfRes = await REST.Lifestyle.my(
      localStorage.getItem("token") as string,
    );

    if (lfRes.status === 200) {
      setLifestyle(lfRes.payload.lifestyle);
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$(
          "components.e2.lifestyle.loading.error",
          lfRes.payload.error,
        ),
      });
      return;
    }
  };

  const loadWeekly = async (date0: string) => {
    const wRes = await REST.Lifestyle.weekly(
      localStorage.getItem("token") as string,
      date0,
    );

    if (wRes.status === 200) {
      setWeekly(wRes.payload.goals);
      setWeeklyDates([wRes.payload.startDate, wRes.payload.endDate]);
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$(
          "components.e2.goals.loading.error",
          wRes.payload.error,
        ),
      });
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
      await loadWeekly(new Date().toDateString());
    })();
  }, []);

  return (
    <>
      <IonCard
        style={{
          "--background": "var(--ion-color-light)",
        }}
      >
        <IonCardHeader>
          <IonCardTitle>{$$("components.e2.weekly.overview")}</IonCardTitle>
          <IonCardSubtitle>
            {new Date(weeklyDates[0]).toLocaleDateString()}
            &nbsp;-&nbsp;
            {new Date(weeklyDates[1]).toLocaleDateString()}
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {weekly &&
            Object.keys(weekly).map((k) => {
              return (
                <>
                  <div>
                    <IonText>
                      {templates.find((t) => t._id === k)?.name}
                    </IonText>
                    <ProgressBar
                      completed={`${
                        weekly[k].actual > weekly[k].goal
                          ? weekly[k].goal
                          : weekly[k].actual
                      }`}
                      maxCompleted={weekly[k].goal}
                      isLabelVisible={false}
                      bgColor={
                        weekly[k].actual > weekly[k].goal
                          ? "var(--ion-color-danger-shade)"
                          : "var(--ion-color-success-shade)"
                      }
                    />
                    <IonText>
                      <small>
                        {$$(
                          "components.e2.goals.reached.how.many",
                          weekly[k].actual.toString(),
                          weekly[k].goal.toString(),
                        )}
                        {weekly[k].actual > weekly[k].goal ? (
                          <>
                            <IonText color={"danger"}>
                              {$$("components.e2.goals.not.reached")}
                            </IonText>
                          </>
                        ) : null}
                      </small>
                    </IonText>
                  </div>
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
          doneText={$$("general.finished")}
          cancelText={$$("control.cancel")}
          max={new Date().toISOString()}
          showDefaultButtons
          onIonChange={(e) => {
            setDate(e.detail.value! as string);
            loadSummary(e.detail.value as string);
            loadWeekly(e.detail.value! as string);
          }}
        ></IonDatetime>
      </IonModal>
      {hasSummaryForDay ? (
        <>
          <IonAccordionGroup>
            <IonAccordion value="first">
              <IonItem slot="header" color="light">
                <IonLabel>
                  {$$("components.e2.summary.of.day")}{" "}
                  {new Date(date).toLocaleDateString()}
                </IonLabel>
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
                              <small>
                                {g.perDay}x{" "}
                                {$$("components.calendar.time.today")}
                              </small>
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
          <IonCard
            style={{
              "--background": "var(--ion-color-light)",
            }}
          >
            <IonCardHeader>
              <IonCardTitle>{$$("components.e2.no.data")}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {$$("components.e2.no.data.description")}
              {
                // check if date is today
                new Date(date).toDateString() === new Date().toDateString() ? (
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
                      {$$("components.e2.add.data")}
                    </IonButton>
                  </>
                ) : (
                  <>
                    <br />
                    {$$("components.e2.cant.add.data")}
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
        loadSummary={(x: string) => {
          loadSummary(x);
          loadWeekly(x);
        }}
      />
    </>
  );
}
