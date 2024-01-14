/**
 * mobile/src/components/E2Analytics.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.09.2023
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { REST } from "@saveworld/api-js";
import { $$ } from "../translations/i18n";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function E2Analytics() {
  const [segment, setSegment] = useState<"4w" | "12w" | "24w">("4w");

  const [data, setData] = useState<
    ChartData<"bar", (number | [number, number] | null)[], never>
  >({
    labels: [],
    datasets: [],
  });

  const loadData = async (s: typeof segment) => {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    let d: ChartData<"bar", (number | [number, number] | null)[], never> = {
      labels: [],
      datasets: [
        {
          label: $$("components.e2.goals.reached"),
          data: [],
          backgroundColor: "#2dd36f",
        },
        {
          label: $$("components.e2.goals.missed"),
          data: [],
          backgroundColor: "#ff0000",
        },
      ],
    };

    let nOw = parseInt(segment.split("w")[0]);

    let dates: string[] = [];

    for (let i = 0; i < nOw; i++) {
      let d = new Date(currentDate.getTime());
      d.setDate(d.getDate() - i * 7);
      dates.push(d.toDateString());
    }

    for (const da of dates) {
      const res = await REST.Lifestyle.weekly(
        localStorage.getItem("token") as string,
        da,
      );

      if (res.status === 200) {
        let startDate = res.payload.startDate;
        let goals = res.payload.goals;

        let success = 0;
        let failed = 0;

        for (const key in goals) {
          if (goals.hasOwnProperty(key)) {
            const goal = goals[key];
            if (goal.actual <= goal.goal) {
              success++;
            } else {
              failed++;
            }
          }
        }

        (d.labels as any).push(
          `ab ${new Date(startDate).toLocaleDateString()}`,
        );
        (d.datasets[0].data as any).push(success);
        (d.datasets[1].data as any).push(failed);
      } else {
        continue;
      }
    }

    setData(d);
  };

  useEffect(() => {
    (async () => {
      await loadData(segment);
    })();
  }, [segment]);

  return (
    <>
      <IonSegment
        value={segment}
        onIonChange={(ev) => {
          let v = ev.detail!.value as typeof segment;
          setSegment(v);
        }}
        style={{
          marginTop: "20px",
        }}
      >
        <IonSegmentButton value={"4w"}>
          <IonLabel>{$$("components.calendar.time.unit.month.one")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value={"12w"}>
          <IonLabel>{$$("components.calendar.time.unit.month.three")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value={"24w"}>
          <IonLabel>{$$("components.calendar.time.unit.month.six")}</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <div>
        <Bar
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
              },
              title: {
                display: true,
                text: $$("components.e2.goals"),
              },
            },
          }}
          data={data}
        />
      </div>
    </>
  );
}
