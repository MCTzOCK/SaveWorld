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
          label: "Erreichte Ziele",
          data: [],
          backgroundColor: "#3880ff",
        },
        {
          label: "Gescheiterte Ziele",
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
          <IonLabel>1 Monat</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value={"12w"}>
          <IonLabel>3 Monate</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value={"24w"}>
          <IonLabel>6 Monate</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <div>
        <Bar
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Ziele",
              },
            },
          }}
          data={data}
        />
      </div>
    </>
  );
}
