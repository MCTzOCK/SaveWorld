/**
 * mobile/src/pages/tools/CO2ECar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.11.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import MobileBox from "../../components/MobileBox";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Select,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { FaGasPump, FaHashtag, FaPlug } from "react-icons/fa";
import PopupManager from "../../util/PopupManager";
import Calculator from "../../components/Calculator";
import { $$ } from "../../translations/i18n";

export default function CO2ECar() {
  return (
    <>
      <Calculator
        title={$$("pages.tools.calc.ecar")}
        description={
          <>
            <p>{$$("pages.tools.calc.ecar.description.long")}</p>
          </>
        }
        inputs={[
          {
            label: $$("pages.tools.calc.distance"),
            id: "distance",
            type: "number",
          },
          {
            label: $$("pages.tools.calc.power.usage"),
            id: "consumption",
            type: "number",
          },
        ]}
        calculate={(v) => {
          let co2 = 0.000485;

          let driven = (v["distance"] / 100) * v["consumption"];

          let resultInTons = driven * co2;
          let result = Math.floor(resultInTons * 1000);
          return result + "kg CO2";
        }}
      />
    </>
  );
}
