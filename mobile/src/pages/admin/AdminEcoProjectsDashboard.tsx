/**
 * mobile/src/pages/admin/AdminEcoProjectsDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.12.2023
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { E2Projects } from "../../util/types/E2Project";
import { REST } from "@saveworld/api-js/index";
import { IResponse } from "@saveworld/api-js/types/IResponse";
import PopupManager from "../../util/PopupManager";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSearchbar,
  useIonRouter,
} from "@ionic/react";
import {
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  Link,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import { FaCheckCircle, FaPen, FaTimesCircle } from "react-icons/fa";
import Page from "../../components/Page";
import { FaTrash } from "react-icons/fa6";
import MobileBox from "../../components/MobileBox";
import { $$ } from "../../translations/i18n";

export default function AdminEcoProjectsDashboard() {
  const router = useIonRouter();
  const [projects, setProjects] = useState<E2Projects>([]);
  const [query, setQuery] = React.useState<string>("");

  const [page, setPage] = React.useState(0);
  const [pages, setPages] = React.useState(0);

  const loadPage = async (p: number) => {
    let res: IResponse = await REST.EcoProjects.projects(
      localStorage.getItem("token") as string,
      p,
      query,
    );

    if (res.status === 200) {
      setProjects(res.payload.entries);
      setPages(res.payload.pages);
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$(
          "pages.admin.e2projects.loading.error",
          res.payload.error,
        ),
      });
    }
  };

  useEffect(() => {
    setPage(0);
    loadPage(0);
  }, [query]);

  useEffect(() => {
    loadPage(page);
  }, [page]);

  return (
    <>
      <Page title={$$("menu.projects")} redGradient>
        <MobileBox bg={"#101010"}>
          <IonSearchbar
            placeholder={$$("control.search")}
            onIonInput={(e) => {
              setQuery(e.detail.value || "");
            }}
            style={{
              padding: 0,
            }}
          />
          <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}>
            {projects.map((p) => {
              return (
                <>
                  <IonCard
                    style={{
                      padding: 0,
                      margin: 4,
                    }}
                  >
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
                      </List>
                      <ButtonGroup w={"100%"} mt={6}>
                        <IconButton
                          aria-label={"Delete"}
                          icon={<FaTrash />}
                          colorScheme={"red"}
                          w={"100%"}
                          variant={"ghost"}
                          onClick={async () => {
                            if (
                              !(await PopupManager.confirmAsync({
                                title: $$("pages.admin.e2projects.delete"),
                                question: $$(
                                  "pages.admin.e2projects.delete.description",
                                ),
                              }))
                            )
                              return;

                            const res = await REST.EcoProjects.deleteProject(
                              localStorage.getItem("token") as string,
                              p._id,
                            );

                            if (res.status !== 200) {
                            } else {
                              await PopupManager.alertAsync({
                                title: $$("control.success"),
                                description: $$(
                                  "pages.admin.e2projects.delete.success",
                                ),
                              });

                              setPage(0);
                              setQuery("");
                              loadPage(0);
                            }
                          }}
                        />
                        <IconButton
                          aria-label={"Edit"}
                          icon={<FaPen />}
                          w={"100%"}
                          colorScheme={"brand"}
                          variant={"ghost"}
                          as={Link}
                          href={"/e2-projects/" + p._id + "/edit"}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push("/e2-projects/" + p._id + "/edit");
                          }}
                        />
                      </ButtonGroup>
                    </IonCardContent>
                  </IonCard>
                </>
              );
            })}
          </Grid>
        </MobileBox>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <ButtonGroup w={"100%"}>
            {page > 0 ? (
              <Button
                color={"var(--ion-color-danger)"}
                onClick={() => setPage(page - 1)}
                w={"100%"}
              >
                {$$("control.back")}
              </Button>
            ) : null}
            {page < pages - 1 ? (
              <Button
                color={"brand.500"}
                onClick={() => setPage(page + 1)}
                w={"100%"}
              >
                {$$("control.next")}
              </Button>
            ) : null}
          </ButtonGroup>
        </div>
      </Page>
    </>
  );
}
