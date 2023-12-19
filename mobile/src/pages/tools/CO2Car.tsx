/**
 * mobile/src/pages/tools/CO2Car.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.11.2023
 *
 */

import * as React from "react";
import Calculator from "../../components/Calculator";

export default function CO2Car() {
  return (
    <>
      <Calculator
        title={"Auto"}
        description={
          <>
            <p>
              Berechne, wie viel CO2 du mit deinem Auto auf einer Strecke
              ausstößt. Die Berechnung basiert auf Daten des Umweltbundesamtes
              (UBA) aus dem Jahr 2022. <br />
              Für die Berechnung benötigst du die Länge der Strecke (in km) und
              den Kraftstoffverbrauch deines Autos (in l/100km). <br />
            </p>
          </>
        }
        inputs={[
          {
            label: "Distanz",
            id: "distance",
            type: "number",
          },
          {
            label: "Kraftstoffart",
            id: "fuel",
            type: "select",
            options: [
              {
                label: "Diesel",
                value: "diesel",
              },
              {
                label: "Benzin",
                value: "petrol",
              },
            ],
          },
          {
            label: "Kraftstoff Verbrauch auf 100km",
            id: "consumption",
            type: "number",
          },
        ]}
        calculate={(v) => {
          let co2 = 0;
          if (v["fuel"] === "diesel") {
            co2 = 0.00341;
          } else {
            co2 = 0.00303;
          }

          let driven = (v["distance"] / 100) * v["consumption"];

          let resultInTons = driven * co2;
          return Math.floor(resultInTons * 1000) + "kg CO2";
        }}
      />
    </>
  );
}
