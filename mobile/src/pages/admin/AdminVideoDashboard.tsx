/**
 * mobile/src/pages/admin/AdminVideoDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useParams } from "react-router";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js/index";
import Page from "../../components/Page";
import {
  IonInput,
  IonItem,
  IonList,
  IonText,
  IonTextarea,
  IonToggle,
  useIonRouter,
} from "@ionic/react";
import PopupManager from "../../util/PopupManager";
import { Box, Flex } from "@chakra-ui/react";
import { $$ } from "../../translations/i18n";

export default function AdminVideoDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [video, setVideo] = React.useState<{
    _id: string;
    title: string;
    description: string;
    streamUrl: string;
    thumbnailUrl: string;
    categories: string[];
    sources: string[];
  } | null>(null);

  const [categories, setCategories] = React.useState<
    {
      _id: string;
      name: string;
      description: string;
      image: string;
    }[]
  >([]);

  const { id } = useParams<{ id: string }>();

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );

  const [sources, setSources] = React.useState<string[]>([]);

  useEffect(() => {
    REST.Content.videoMetadata(id).then((res) => {
      if (res.status === 200) {
        setVideo(res.payload.video);
        setSelectedCategories(res.payload.video.categories);
        setSources(res.payload.video.sources);
      } else {
        PopupManager.alert({
          title: $$("control.error"),
          description: $$("pages.admin.video.loading.error", res.payload.error),
        });
      }
    });
    REST.Content.categories().then((res) => {
      if (res.status === 200) {
        setCategories(res.payload as any);
      } else {
        PopupManager.alert({
          title: $$("control.error"),
          description: $$(
            "pages.admin.category.loading.error",
            res.payload.error,
          ),
        });
      }
    });
  }, []);

  const router = useIonRouter();

  return (
    <>
      <Page title={video?.title || $$("general.loading")} redGradient>
        {video && (
          <>
            <Flex
              w={"100%"}
              justifyContent={["flex-start", "center"]}
              alignItems={["flex-start", "center"]}
              minH={"100vh"}
            >
              <Box w={["100%", "75%", "50%", "25%"]} minW={"200px"}>
                <IonList inset>
                  <IonItem color={"light"}>
                    <IonInput
                      label={$$("pages.admin.video.form.title")}
                      value={video.title}
                      labelPlacement={"fixed"}
                      id={"update-video-title"}
                    />
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonTextarea
                      label={$$("pages.admin.video.form.description")}
                      value={video.description}
                      labelPlacement={"fixed"}
                      id={"update-video-desc"}
                    />
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonTextarea
                      placeholder={$$(
                        "pages.admin.video.form.sources.placeholder",
                      )}
                      label={$$("pages.admin.video.form.sources")}
                      labelPlacement={"fixed"}
                      autoGrow
                      id={"create-vid-sources"}
                      value={sources.join("\n")}
                      onIonChange={(ev) => {
                        setSources(ev.detail.value?.split("\n") || []);
                      }}
                    />
                  </IonItem>
                  {categories.map((c) => {
                    return (
                      <>
                        <IonItem color={"light"}>
                          <IonToggle
                            slot={"end"}
                            checked={selectedCategories.includes(c._id)}
                            onIonChange={(ev) => {
                              if (ev.detail.checked) {
                                setSelectedCategories([
                                  ...selectedCategories,
                                  c._id,
                                ]);
                              } else {
                                setSelectedCategories(
                                  selectedCategories.filter(
                                    (sc) => sc !== c._id,
                                  ),
                                );
                              }
                            }}
                          />
                          {c.name}
                        </IonItem>
                      </>
                    );
                  })}
                  <IonItem
                    color={"light"}
                    detail
                    onClick={async () => {
                      const title = (
                        document.getElementById(
                          "update-video-title",
                        ) as HTMLIonInputElement
                      ).value as string;
                      const desc = (
                        document.getElementById(
                          "update-video-desc",
                        ) as HTMLIonTextareaElement
                      ).value as string;

                      const res = await REST.Admin.updateVideo(
                        localStorage.getItem("token") as string,
                        video!._id,
                        title,
                        desc,
                        selectedCategories,
                        sources,
                      );
                      if (res.status === 200) {
                        PopupManager.alert({
                          title: $$("control.success"),
                          description: $$("pages.admin.video.updated.success"),
                          callback: () => {
                            router.push(router.routeInfo.pathname);
                          },
                        });
                      } else {
                        PopupManager.alert({
                          title: $$("control.error"),
                          description: $$(
                            "pages.admin.video.updated.error",
                            res.payload.error,
                          ),
                        });
                      }
                    }}
                  >
                    <IonText color={"primary"}>{$$("control.save")}</IonText>
                  </IonItem>
                  <IonItem
                    color={"light"}
                    detail
                    onClick={async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: $$("control.delete"),
                          question: $$("pages.admin.video.delete.confirm"),
                        }))
                      )
                        return;

                      const res = await REST.Admin.deleteVideo(
                        localStorage.getItem("token") as string,
                        video?._id,
                      );

                      if (res.status === 200) {
                        PopupManager.alert({
                          title: $$("control.success"),
                          description: $$("pages.admin.video.deleted"),
                          callback: () => {
                            router.push(router.routeInfo.pathname);
                          },
                        });
                      } else {
                        PopupManager.alert({
                          title: $$("control.error"),
                          description: $$(
                            "pages.admin.video.deleted.error",
                            res.payload.error,
                          ),
                        });
                      }
                    }}
                  >
                    <IonText color={"danger"}>{$$("control.delete")}</IonText>
                  </IonItem>
                </IonList>
              </Box>
            </Flex>
          </>
        )}
      </Page>
    </>
  );
}
