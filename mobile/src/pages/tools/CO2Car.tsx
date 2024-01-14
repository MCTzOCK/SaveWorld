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
import { $$ } from "../../translations/i18n";

export default function CO2Car() {
  return (
    <>
      <Calculator
        title={$$("pages.tools.calc.car")}
        description={
          <>
            <p>{$$("pages.tools.calc.car.description.long")}</p>
          </>
        }
        inputs={[
          {
            label: $$("pages.tools.calc.distance"),
            id: "distance",
            type: "number",
          },
          {
            label: $$("pages.tools.calc.fuel.type"),
            id: "fuel",
            type: "select",
            options: [
              {
                label: $$("pages.tools.calc.fuel.type.diesel"),
                value: "diesel",
              },
              {
                label: $$("pages.tools.calc.fuel.type.petrol"),
                value: "petrol",
              },
            ],
          },
          {
            label: $$("pages.tools.calc.fuel.usage"),
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
