/**
 * mobile/src/pages/tools/CO2LongDistanceTrain.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import Calculator from "../../components/Calculator";

export default function CO2LongDistanceTrain() {
  return (
    <>
      <Calculator
        title={"Fernzug"}
        description={
          <>
            <p>
              Berechne, wie viel CO2 du mit auf einer Strecke mit dem Fernzug
              ausstößt. Die Berechnung basiert auf Daten von Quarks. <br />
              Für die Berechnung benötigst du die Länge der Strecke (in km).{" "}
              <br />
              Pro km werden 0,036kg CO2 ausgestoßen, weswegen durch Rundung
              Abweichungen entstehen können.
            </p>
          </>
        }
        inputs={[
          {
            label: "Distanz",
            id: "distance",
            type: "number",
          },
        ]}
        calculate={(v) => {
          let co2 = 36;

          const result = Math.floor((v["distance"] * co2) / 100);

          return result + "kg CO2";
        }}
      />
    </>
  );
}
