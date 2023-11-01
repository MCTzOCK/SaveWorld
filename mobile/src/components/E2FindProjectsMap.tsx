/**
 * mobile/src/components/E2FindProjectsMap.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.10.2023
 *
 */

import * as React from "react";
import { Map, Marker } from "mapkit-react";
import { APPLE_MAP_KIT_TOKEN, ENDPOINT } from "../env";
import { Box, Button, Grid, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { E2Projects } from "../util/types/E2Project";
import { REST } from "@saveworld/api-js";
import PopupManager from "../util/PopupManager";
import moment from "moment/moment";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  useIonRouter,
} from "@ionic/react";

export default function E2FindProjectsMap() {
  const [geoLocs, setGeoLocs] = useState<string[][]>([]);

  useEffect(() => {
    REST.EcoProjects.geoLocations(localStorage.getItem("token") as string).then(
      (res) => {
        setGeoLocs(res.payload.entries);
      },
    );
  }, []);

  const router = useIonRouter();

  return (
    <>
      <Box
        style={{
          width: "100%",
          height: "80vh",
        }}
      >
        <Map
          token={APPLE_MAP_KIT_TOKEN}
          showsCompass={0}
          allowWheelToZoom={true}
          showsUserLocation={true}
          tracksUserLocation={true}
        >
          {geoLocs.map((loc, i) => {
            return (
              <Marker
                latitude={parseFloat(loc[0])}
                longitude={parseFloat(loc[1])}
                onSelect={async () => {
                  const res = await REST.EcoProjects.getByLatLon(
                    localStorage.getItem("token") as string,
                    loc[0],
                    loc[1],
                  );

                  if (res.payload.entries.length > 0) {
                    PopupManager.alert({
                      title: "Projekte an diesem Ort",
                      description: (
                        <>
                          <Grid templateColumns={["repeat(1, 1fr)"]}>
                            {res.payload.entries.map((p: any) => {
                              return (
                                <IonCard
                                  style={{
                                    padding: 0,
                                    margin: 0,
                                  }}
                                >
                                  <IonCardHeader>
                                    <IonCardSubtitle>
                                      {moment(p.startDate).format("DD.MM.YYYY")}
                                      -
                                      {moment(p.startDate)
                                        .add(p.lastsDays, "days")
                                        .format("DD.MM.YYYY")}
                                    </IonCardSubtitle>
                                    <IonCardTitle>{p.name}</IonCardTitle>
                                  </IonCardHeader>
                                  <IonCardContent>
                                    {p.geoLocationDisplayName}
                                    <VStack>
                                      <Button
                                        w={"100%"}
                                        color={"saveworld_green.500"}
                                        onClick={() => {
                                          window.open(
                                            ENDPOINT +
                                              "/eco-projects/project/calendar.ics?id=" +
                                              p._id,
                                            "_blank",
                                          );
                                        }}
                                      >
                                        Zum Kalender hinzufügen
                                      </Button>
                                      <Button
                                        w={"100%"}
                                        color={"saveworld_green.500"}
                                        onClick={() => {
                                          router.push(
                                            "/e2-projects/" + p._id,
                                            "none",
                                            "replace",
                                          );
                                        }}
                                      >
                                        Zum Projekt
                                      </Button>
                                    </VStack>
                                  </IonCardContent>
                                </IonCard>
                              );
                            })}
                          </Grid>
                        </>
                      ),
                    });
                  }
                }}
              />
            );
          })}
        </Map>
      </Box>
    </>
  );
}
