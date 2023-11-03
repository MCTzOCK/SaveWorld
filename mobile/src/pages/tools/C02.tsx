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
  useIonRouter,
} from "@ionic/react";

export default function C02() {
  const router = useIonRouter();

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
          <Card
            backgroundColor={
              "var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)))"
            }
          >
            <CardHeader>
              <Image
                src={"/assets/calculator/co2/car_emissions.jpg"}
                rounded={"md"}
              />
              <p>
                <b>Quelle</b>: <i>Unsplash, Matt Boitor</i>
              </p>
              <Heading size={"lg"}>Auto</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                Rechne aus, wie viel CO2 du mit deinem Auto auf einer bestimmten
                Strecke ausstößt. <br />
                <b>Quelle</b>:&nbsp;
                <i>UBA 2022: Emissionsbilanz erneuerbarer Energieträger</i>
              </Text>
              <ButtonGroup w={"100%"} mt={4}>
                <Button
                  color={"saveworld_green.500"}
                  w={"100%"}
                  onClick={() => {
                    router.push("/tools/co2/car", "none", "push");
                  }}
                >
                  Berechnen
                </Button>
              </ButtonGroup>
            </CardBody>
          </Card>
          <Card
            backgroundColor={
              "var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)))"
            }
          >
            <CardHeader>
              <Image src={"/assets/calculator/co2/e-car.jpg"} rounded={"md"} />
              <p>
                <b>Quelle</b>: <i>Unsplash, Remy Lovesy</i>
              </p>
              <Heading size={"lg"}>Elektro Auto</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                Rechne aus, wie viel CO2 du mit deinem Elektro Auto auf einer
                bestimmten Strecke, durch den Stromverbrauch, ausstößt. <br />
                <b>Quelle</b>:&nbsp;
                <i>UBA 2022: Emissionsbilanz erneuerbarer Energieträger</i>
              </Text>
              <ButtonGroup w={"100%"} mt={4}>
                <Button
                  color={"saveworld_green.500"}
                  w={"100%"}
                  onClick={() => {
                    router.push("/tools/co2/e-car", "none", "push");
                  }}
                >
                  Berechnen
                </Button>
              </ButtonGroup>
            </CardBody>
          </Card>
        </Grid>
      </Page>
    </>
  );
}
