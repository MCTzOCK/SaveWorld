/**
 * mobile/src/pages/eatingplans/EatingPlanViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useEffect, useState } from "react";
import { IonSpinner } from "@ionic/react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { REST } from "@saveworld/api-js";
import { useParams } from "react-router";
import PopupManager from "../../util/PopupManager";

export default function EatingPlanViewer() {
  useRedirectForAnon();

  const { date } = useParams<{ date: string }>();

  const [plan, setPlan] = useState<MEatingPlan | null>(null);

  useEffect(() => {
    reload();
  }, [date]);

  const reload = async () => {
    if (!date) return;
    const res = await REST.EatingPlans.eatingPlan(
      localStorage.getItem("token") as string,
      date,
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Der Essensplan konnte nicht geladen werden: " + res.payload.error,
      });
      return;
    }

    setPlan(res.payload.plan);
  };

  return (
    <>
      <Page
        title={plan ? new Date(plan.date).toLocaleDateString() : "Laden..."}
      >
        {!plan ? (
          <>
            <IonSpinner />
          </>
        ) : (
          <>{JSON.stringify(plan)}</>
        )}
      </Page>
    </>
  );
}
