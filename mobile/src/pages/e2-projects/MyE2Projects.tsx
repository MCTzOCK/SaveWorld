/**
 * mobile/src/pages/e2-projects/MyE2Projects.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../../util/PopupManager";
import { E2Projects } from "../../util/types/E2Project";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
  IonSearchbar,
  useIonRouter,
} from "@ionic/react";
import { Button, Grid, List, ListIcon, ListItem } from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import HighlightedText from "../../components/HighlightedText";
import { useUserData } from "../../hooks/useUserData";
import { checkmark, chevronDown } from "ionicons/icons";
import { $$ } from "../../translations/i18n";

export default function MyE2Projects() {
  useRedirectForAnon();

  const [projects, setProjects] = React.useState<E2Projects>([]);

  const [query, setQuery] = useState<string>("");

  const { userInfo } = useUserData();
  const [filter, setFilter] = useState<"all" | "owner" | "only-upcoming">(
    "all",
  );

  useEffect(() => {
    reloadProjects();
  }, []);

  const reloadProjects = async () => {
    const res = await REST.EcoProjects.my(
      localStorage.getItem("token") as string,
    );

    if (res.status === 200) {
      setProjects(res.payload.projects);
    } else {
      await PopupManager.alertAsync({
        title: $$("control.error"),
        description: $$("pages.e2projects.my.loading.error", res.payload.error),
      });
    }
  };

  const router = useIonRouter();

  return (
    <>
      <Page title={$$("pages.e2projects.my")}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "5px",
            alignItems: "center",
          }}
        >
          <IonSearchbar
            placeholder={$$("control.search")}
            onIonInput={(e) => {
              setQuery(e.detail.value || "");
            }}
            style={{
              padding: 0,
            }}
          />
          <IonButton
            id={"open-type-popover"}
            size={"small"}
            fill={"outline"}
            color={"success"}
          >
            {filter === "all"
              ? $$("pages.e2projects.filter.all")
              : filter === "owner"
              ? $$("pages.e2projects.my")
              : $$("pages.e2projects.filter.upcoming")}
            <IonIcon icon={chevronDown} slot={"end"} />
          </IonButton>
          <IonPopover trigger={"open-type-popover"} dismissOnSelect>
            <IonContent>
              <IonList>
                <IonItem
                  button={true}
                  detail={false}
                  onClick={() => {
                    setFilter("all");
                  }}
                  color={"light"}
                >
                  {filter === "all" && (
                    <IonIcon icon={checkmark} color={"success"} slot={"end"} />
                  )}
                  {$$("pages.e2projects.filter.all")}
                </IonItem>
                <IonItem
                  button={true}
                  detail={false}
                  onClick={() => {
                    setFilter("owner");
                  }}
                  color={"light"}
                >
                  {filter === "owner" && (
                    <IonIcon icon={checkmark} color={"success"} slot={"end"} />
                  )}
                  {$$("pages.e2projects.my")}
                </IonItem>
                <IonItem
                  button={true}
                  detail={false}
                  onClick={() => {
                    setFilter("only-upcoming");
                  }}
                  color={"light"}
                >
                  {filter === "only-upcoming" && (
                    <IonIcon icon={checkmark} color={"success"} slot={"end"} />
                  )}
                  {$$("pages.e2projects.filter.upcoming")}
                </IonItem>
              </IonList>
            </IonContent>
          </IonPopover>
        </div>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
        >
          {projects
            .filter((p) => {
              if (query === "") {
                return true;
              }
              return (
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.geoLocationDisplayName
                  .toLowerCase()
                  .includes(query.toLowerCase())
              );
            })
            .filter((p) => {
              if (filter === "all") return true;
              if (filter === "owner") return p.owner === userInfo._id;
              if (filter === "only-upcoming") {
                return (
                  new Date(p.startDate).getTime() +
                    p.lastsDays * 24 * 60 * 60 * 1000 >
                  new Date().getTime()
                );
              }
              return false;
            })
            .map((p) => {
              return (
                <>
                  <IonCard routerLink={"/e2-projects/" + p._id}>
                    <IonCardHeader>
                      <IonCardTitle>{p.name}</IonCardTitle>
                      <IonCardSubtitle>
                        {new Date(p.startDate).toLocaleDateString()}-
                        {new Date(
                          new Date(p.startDate).getTime() +
                            p.lastsDays * 24 * 60 * 60 * 1000,
                        ).toLocaleDateString()}
                      </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <List spacing={3}>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color={"brand.500"} />
                          {p.geoLocationDisplayName}
                          {p.geoLocationLon.length > 0 &&
                            p.geoLocationLat.length > 0 && (
                              <>
                                <br />({p.geoLocationLat}, {p.geoLocationLon})
                              </>
                            )}
                        </ListItem>
                        <ListItem>
                          <ListIcon
                            as={
                              p.geoLocationType === "nominatim"
                                ? FaCheckCircle
                                : FaTimesCircle
                            }
                            color={
                              p.geoLocationType === "nominatim"
                                ? "brand.500"
                                : "var(--ion-color-danger)"
                            }
                          />
                          {p.geoLocationType === "nominatim"
                            ? $$("pages.e2projects.map.findable")
                            : $$("pages.e2projects.map.unfindable")}
                        </ListItem>
                        {p.geoLocationType !== "nominatim" && (
                          <ListItem>
                            {$$("pages.e2projects.map.unfindable.description")}
                          </ListItem>
                        )}
                      </List>
                    </IonCardContent>
                  </IonCard>
                </>
              );
            })}
          {projects
            .filter((p) => {
              if (query === "") {
                return true;
              }
              return (
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.geoLocationDisplayName
                  .toLowerCase()
                  .includes(query.toLowerCase())
              );
            })
            .filter((p) => {
              if (filter === "all") return true;
              if (filter === "owner") return p.owner === userInfo._id;
              if (filter === "only-upcoming") {
                return (
                  new Date(p.startDate).getTime() +
                    p.lastsDays * 24 * 60 * 60 * 1000 >
                  new Date().getTime()
                );
              }
              return false;
            }).length === 0 && (
            <>
              <IonCard>
                <IonCardContent>
                  {$$("pages.e2projects.no.projects")}
                  <Button
                    color={"brand.500"}
                    w={"100%"}
                    mt={4}
                    onClick={() => {
                      router.push("/e2-projects/new", "forward", "push");
                    }}
                  >
                    {$$("pages.e2projects.create")}
                  </Button>
                </IonCardContent>
              </IonCard>
            </>
          )}
        </Grid>
      </Page>
    </>
  );
}
