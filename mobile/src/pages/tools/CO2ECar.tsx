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
  Text,
} from "@chakra-ui/react";
import { FaGasPump, FaHashtag, FaPlug } from "react-icons/fa";
import PopupManager from "../../util/PopupManager";

export default function CO2ECar() {
  const [distance, setDistance] = React.useState(0);
  const [consumption, setConsumption] = React.useState(0);

  return (
    <>
      <Page title={"CO2-Rechner: E-Auto"}>
        <MobileBox>
          <Text>
            Berechne, wie viel CO2 du mit deinem Auto auf einer Strecke
            ausstößt. Die Berechnung basiert auf Daten des Umweltbundesamtes
            (UBA) aus dem Jahr 2022. <br />
            Für die Berechnung benötigst du die Länge der Strecke (in km) und
            den Stromverbrauch deines Autos (in kWh/100km). <br />
          </Text>
          <Stack mt={6} gap={4}>
            <FormControl>
              <FormLabel>Distanz</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  <FaHashtag />
                </InputLeftAddon>
                <Input
                  type={"number"}
                  placeholder={"Kilometer"}
                  value={distance}
                  onChange={(e) => {
                    setDistance(parseFloat(e.target.value));
                  }}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Stromverbrauch auf 100km</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  <FaPlug />
                </InputLeftAddon>
                <Input
                  type={"number"}
                  placeholder={"kWh/100km"}
                  value={consumption}
                  onChange={(e) => {
                    setConsumption(parseFloat(e.target.value));
                  }}
                />
              </InputGroup>
            </FormControl>
            <Button
              color={"saveworld_green.500"}
              onClick={() => {
                let co2 = 0.000485;

                let driven = (distance / 100) * consumption;

                let resultInTons = driven * co2;
                let result = Math.floor(resultInTons * 1000);

                PopupManager.alertAsync({
                  title: "Ergebnis",
                  description:
                    "Eine Strecke von " +
                    distance +
                    "km mit einem Verbrauch von " +
                    consumption +
                    "kWh/100km verursacht etwa " +
                    result +
                    "kg CO2.",
                });
              }}
            >
              Berechnen
            </Button>
          </Stack>
        </MobileBox>
      </Page>
    </>
  );
}
