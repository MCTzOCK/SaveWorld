/**
 * mobile/src/pages/tools/C02.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.11.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonSearchbar,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";

const calculators: {
  title: string;
  image: {
    url: string;
    cpr: string;
  };
  description: string;
  cpr: string;
  url: string;
}[] = [
  {
    title: "Auto",
    image: {
      url: "/assets/calculator/co2/car_emissions.jpg",
      cpr: "Unsplash, Matt Boitor",
    },
    cpr: "UBA 2022: Emissionsbilanz erneuerbarer Energieträger",
    description:
      "Rechne aus, wie viel CO2 du mit deinem Auto auf einer bestimmten Strecke ausstößt.",
    url: "/tools/co2/car",
  },
  {
    title: "Elektro Auto",
    image: {
      url: "/assets/calculator/co2/e-car.jpg",
      cpr: "Unsplash, Remy Lovesy",
    },
    cpr: "UBA 2022: Emissionsbilanz erneuerbarer Energieträger",
    description:
      "Rechne aus, wie viel CO2 du mit deinem Elektro Auto auf einer bestimmten Strecke, durch den Stromverbrauch, ausstößt.",
    url: "/tools/co2/e-car",
  },
  {
    title: "Wasserstoff Auto",
    image: {
      url: "/assets/calculator/co2/h-car.jpg",
      cpr: "Unsplash, Darren Halstead",
    },
    cpr: "UBA 2022: Emissionsbilanz erneuerbarer Energieträger",
    description:
      "Rechne aus, wie viel CO2 du mit deinem Wasserstoff Auto auf einer bestimmten Strecke, durch den Wasserstoffverbrauch, ausstößt.",
    url: "/tools/co2/h-car",
  },
];

export default function C02() {
  const router = useIonRouter();

  const [query, setQuery] = useState<string>("");

  return (
    <>
      <Page title={"CO2-Rechner"}>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
          gap={4}
        >
          <IonSearchbar
            placeholder={"Suchen..."}
            onIonInput={(e) => {
              setQuery(e.detail.value!);
            }}
            style={{
              padding: 0,
            }}
          />
          {calculators.filter((calc) => {
            if (query === "") return true;
            return (
              calc.title.toLowerCase().includes(query.toLowerCase()) ||
              calc.description.toLowerCase().includes(query.toLowerCase())
            );
          }).length === 0 && (
            <>
              <Heading size={"md"}>
                Es wurden keine CO2-Rechner für "{query}" gefunden.
              </Heading>
            </>
          )}
          {calculators
            .filter((calc) => {
              if (query === "") return true;
              return (
                calc.title.toLowerCase().includes(query.toLowerCase()) ||
                calc.description.toLowerCase().includes(query.toLowerCase())
              );
            })
            .map((calc) => {
              return (
                <>
                  <Card
                    backgroundColor={
                      "var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)))"
                    }
                  >
                    <CardHeader>
                      <Image src={calc.image.url} rounded={"md"} />
                      <p>
                        <b>Quelle</b>: <i>{calc.image.cpr}</i>
                      </p>
                      <Heading size={"lg"}>{calc.title}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text>
                        {calc.description}
                        <br />
                        <b>Quelle</b>:&nbsp;
                        <i>{calc.cpr}</i>
                      </Text>
                      <ButtonGroup w={"100%"} mt={4}>
                        <Button
                          color={"saveworld_green.500"}
                          w={"100%"}
                          onClick={() => {
                            router.push(calc.url, "none", "push");
                          }}
                        >
                          Berechnen
                        </Button>
                      </ButtonGroup>
                    </CardBody>
                  </Card>
                </>
              );
            })}
        </Grid>
      </Page>
    </>
  );
}
