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
import { $$ } from "../../translations/i18n";

export default function CO2LongDistanceTrain() {
  return (
    <>
      <Calculator
        title={$$("pages.tools.calc.train")}
        description={
          <>
            <p>{$$("pages.tools.calc.train.description.long")}</p>
          </>
        }
        inputs={[
          {
            label: $$("pages.tools.calc.distance"),
            id: "distance",
            type: "number",
          },
        ]}
        calculate={(v) => {
          let co2 = 0.36;


          const result = Math.floor((v["distance"] * co2) / 10);

          return result + "kg CO2";
        }}
      />
    </>
  );
}
