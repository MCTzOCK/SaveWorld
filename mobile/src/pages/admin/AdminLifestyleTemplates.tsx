/**
 * mobile/src/pages/admin/AdminLifestyleTemplates.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import {
  IonActionSheet,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonRow,
  IonSearchbar,
} from "@ionic/react";
import {
  add,
  addSharp,
  pencil,
  pencilSharp,
  trash,
  trashSharp,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../../util/PopupManager";
import MobileBox from "../../components/MobileBox";
import {
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Grid,
  IconButton,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { $$ } from "../../translations/i18n";

export default function AdminLifestyleTemplates() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [templates, setTemplates] = useState<
    {
      name: string;
      goal: string;
    }[]
  >([]);

  const reload = async () => {
    setQuery("");
    const tplR = await REST.Lifestyle.templates();
    if (tplR.status === 200) {
      setTemplates(tplR.payload.lst);
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$(
          "pages.admin.lifestyle.loading.error",
          tplR.payload.error,
        ),
      });
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const [query, setQuery] = useState<string>("");

  return (
    <>
      <Page title={$$("menu.lifestyle")} redGradient>
        <MobileBox bg={"#101010"}>
          <IonSearchbar
            placeholder={$$("control.search")}
            value={query}
            onIonInput={(ev) => {
              setQuery((ev.detail.value || "").trim());
            }}
            style={{
              padding: 0,
            }}
          />
          {templates && (
            <div>
              <Grid
                templateColumns={[
                  "repeat(1, 1fr)",
                  "repeat(2, 1fr)",
                  "repeat(3, 1fr)",
                  "repeat(4, 1fr)",
                ]}
                gap={4}
              >
                {templates
                  .filter((tpl) => {
                    if (query === "") return true;
                    return (
                      tpl.name.toLowerCase().includes(query.toLowerCase()) ||
                      tpl.goal.toLowerCase().includes(query.toLowerCase())
                    );
                  })
                  .map((tpl) => {
                    return (
                      <>
                        <Card bgColor={"gray.900"}>
                          <CardBody>
                            {tpl.name}
                            <br />
                            <br />
                            {tpl.goal}
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
                                      title: $$("control.delete"),
                                      question: $$(
                                        "pages.admin.lifestyle.delete.description",
                                      ),
                                    }))
                                  )
                                    return;
                                  const delR =
                                    await REST.Admin.deleteLifestyleTemplate(
                                      localStorage.getItem("token") as string,
                                      (tpl as any)._id,
                                    );
                                  if (delR.status === 200) {
                                    await reload();
                                  } else {
                                    PopupManager.alert({
                                      title: $$("control.error"),
                                      description: $$(
                                        "pages.admin.lifestyle.delete.error",
                                        delR.payload.error,
                                      ),
                                    });
                                  }
                                }}
                              />
                              <IconButton
                                aria-label={"Edit"}
                                icon={<FaPen />}
                                w={"100%"}
                                colorScheme={"brand"}
                                variant={"ghost"}
                                onClick={async () => {
                                  const name = await PopupManager.promptAsync({
                                    title: $$(
                                      "pages.admin.lifestyle.new.title",
                                    ),
                                    helperText: $$(
                                      "pages.admin.lifestyle.new.title",
                                    ),
                                    inputType: "INPUT",
                                  });

                                  const goal = await PopupManager.promptAsync({
                                    title: $$("pages.admin.lifestyle.new.goal"),
                                    helperText: $$(
                                      "pages.admin.lifestyle.new.goal",
                                    ),
                                    inputType: "INPUT",
                                  });
                                  if (name && goal) {
                                    const tplR =
                                      await REST.Admin.updateLifestyleTemplate(
                                        localStorage.getItem("token") as string,
                                        (tpl as any)._id,
                                        name,
                                        goal,
                                      );
                                    if (tplR.status === 200) {
                                      await reload();
                                    } else {
                                      PopupManager.alert({
                                        title: $$("control.error"),
                                        description: $$(
                                          "pages.admin.lifestyle.delete.error",
                                          tplR.payload.error,
                                        ),
                                      });
                                    }
                                  }
                                }}
                              />
                            </ButtonGroup>
                          </CardBody>
                        </Card>
                      </>
                    );
                  })}
              </Grid>
            </div>
          )}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton
              color={"danger"}
              onClick={async () => {
                const name = await PopupManager.promptAsync({
                  title: $$("pages.admin.lifestyle.new.title"),
                  helperText: $$("pages.admin.lifestyle.new.title"),
                  inputType: "INPUT",
                });

                const goal = await PopupManager.promptAsync({
                  title: $$("pages.admin.lifestyle.new.goal"),
                  helperText: $$("pages.admin.lifestyle.new.goal"),
                  inputType: "INPUT",
                });

                if (name && goal) {
                  const tplR = await REST.Admin.createLifestyleTemplate(
                    localStorage.getItem("token") as string,
                    name,
                    goal,
                  );
                  if (tplR.status === 200) {
                    await reload();
                  } else {
                    PopupManager.alert({
                      title: $$("control.error"),
                      description: $$(
                        "pages.admin.lifestyle.create.error",
                        tplR.payload.error,
                      ),
                    });
                  }
                }
              }}
            >
              <IonIcon ios={add} md={addSharp} />
            </IonFabButton>
          </IonFab>
        </MobileBox>
      </Page>
    </>
  );
}
