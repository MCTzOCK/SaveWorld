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
import { $$ } from "../../translations/i18n";

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
    title: $$("pages.tools.calc.car"),
    image: {
      url: "/assets/calculator/co2/car_emissions.jpg",
      cpr: "Unsplash, Matt Boitor",
    },
    cpr: "UBA 2022: Emissionsbilanz erneuerbarer Energieträger",
    description: $$("pages.tools.calc.car.description"),
    url: "/tools/co2/car",
  },
  {
    title: $$("pages.tools.calc.ecar"),
    image: {
      url: "/assets/calculator/co2/e-car.jpg",
      cpr: "Unsplash, Remy Lovesy",
    },
    cpr: "UBA 2022: Emissionsbilanz erneuerbarer Energieträger",
    description: $$("pages.tools.calc.ecar.description"),
    url: "/tools/co2/e-car",
  },
  {
    title: $$("pages.tools.calc.hcar"),
    image: {
      url: "/assets/calculator/co2/h-car.jpg",
      cpr: "Unsplash, Darren Halstead",
    },
    cpr: "UBA 2022: Emissionsbilanz erneuerbarer Energieträger",
    description: $$("pages.tools.calc.hcar.description"),
    url: "/tools/co2/h-car",
  },
  {
    title: $$("pages.tools.calc.train"),
    image: {
      url: "/assets/calculator/co2/long-distance-train.jpg",
      cpr: "Unsplash, Daniel Abadia",
    },
    cpr: "Quarks",
    description: $$("pages.tools.calc.train.description"),
    url: "/tools/co2/long-distance-train",
  },
];

export default function C02() {
  const router = useIonRouter();

  const [query, setQuery] = useState<string>("");

  return (
    <>
      <Page title={$$("pages.tools.calc")}>
        <IonSearchbar
          placeholder={$$("control.search")}
          onIonInput={(e) => {
            setQuery(e.detail.value!);
          }}
          style={{
            padding: 0,
          }}
        />
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
          gap={4}
        >
          {calculators.filter((calc) => {
            if (query === "") return true;
            return (
              calc.title.toLowerCase().includes(query.toLowerCase()) ||
              calc.description.toLowerCase().includes(query.toLowerCase())
            );
          }).length === 0 && (
            <>
              <Heading size={"md"}>
                {$$("pages.tools.calc.search.no.results")}
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
                        <b>{$$("pages.tools.calc.source")}</b>:{" "}
                        <i>{calc.image.cpr}</i>
                      </p>
                      <Heading size={"lg"}>{calc.title}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text>
                        {calc.description}
                        <br />
                        <b>{$$("pages.tools.calc.source")}</b>:&nbsp;
                        <i>{calc.cpr}</i>
                      </Text>
                      <ButtonGroup w={"100%"} mt={4}>
                        <Button
                          color={"brand.500"}
                          w={"100%"}
                          onClick={() => {
                            router.push(calc.url, "none", "push");
                          }}
                        >
                          {$$("pages.tools.calc.calculate")}
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
