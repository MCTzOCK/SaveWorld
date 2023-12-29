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

export default function CO2ECar() {
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
              den Stromverbrauch deines Autos (in kWh/100km). <br />
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
            label: "Stromverbrauch auf 100km",
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
