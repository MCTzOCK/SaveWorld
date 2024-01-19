/**
 * mobile/src/pages/admin/AdminVideosDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { add, addSharp, star, starSharp } from "ionicons/icons";
import AdminCreateVideoModal from "../../components/AdminCreateVideoModal";
import PopupManager from "../../util/PopupManager";
import { Grid, UnorderedList, useDisclosure } from "@chakra-ui/react";
import MobileBox from "../../components/MobileBox";
import AdminVideoEditModal from "../../components/AdminVideoEditModal";
import { $$ } from "../../translations/i18n";

export default function AdminVideosDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [videos, setVideos] = useState<
    {
      _id: string;
      title: string;
      description: string;
      streamUrl: string;
      thumbnailUrl: string;
      categories: string[];
      sources: string[];
      ratings: number[];
    }[]
  >([]);
  const [videoCount, setVideoCount] = useState<number>(0);

  const [currentVideo, setCurrentVideo] = useState<{
    _id: string;
    title: string;
    description: string;
    streamUrl: string;
    thumbnailUrl: string;
    categories: string[];
    sources: string[];
    ratings: number[];
  }>({
    _id: "",
    title: "",
    description: "",
    streamUrl: "",
    thumbnailUrl: "",
    categories: [],
    sources: [],
    ratings: [],
  });

  const [page, setPage] = useState(1);

  const reload = async (forcePage?: number) => {
    let p = forcePage || page;

    const res = await REST.Admin.videos(
      localStorage.getItem("token") as string,
      p,
    );

    if (res.status === 200) {
      setVideos([...videos, ...res.payload.videos]);
      setVideoCount(res.payload.count);
      if (!forcePage) {
        setPage(p + 1);
      }
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$("pages.admin.videos.loading.error", res.payload.error),
      });
    }
  };
  useEffect(() => {
    reload();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const router = useIonRouter();

  return (
    <>
      <Page title={$$("menu.videos")} redGradient>
        <MobileBox bg={"#101010"}>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
          >
            {videos.map((video) => {
              return (
                <IonCard
                  onClick={() => {
                    setCurrentVideo(video);
                    onOpen();
                  }}
                >
                  <IonCardHeader>
                    <IonCardTitle>{video.title}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText>{video.description}</IonText>
                    <br />
                    <br />
                    {video.streamUrl}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        marginTop: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <IonIcon
                        ios={star}
                        md={starSharp}
                        color={
                          (Math.round(
                            (video?.ratings as number[]).reduce(
                              (a, b) => a + b,
                              0,
                            ) / (video?.ratings as number[]).length,
                          ) || 0) > 0
                            ? "warning"
                            : "medium"
                        }
                      />
                      <IonIcon
                        ios={star}
                        md={starSharp}
                        color={
                          (Math.round(
                            (video?.ratings as number[]).reduce(
                              (a, b) => a + b,
                              0,
                            ) / (video?.ratings as number[]).length,
                          ) || 0) > 1
                            ? "warning"
                            : "medium"
                        }
                      />
                      <IonIcon
                        ios={star}
                        md={starSharp}
                        color={
                          (Math.round(
                            (video?.ratings as number[]).reduce(
                              (a, b) => a + b,
                              0,
                            ) / (video?.ratings as number[]).length,
                          ) || 0) > 2
                            ? "warning"
                            : "medium"
                        }
                      />
                      <IonIcon
                        ios={star}
                        md={starSharp}
                        color={
                          (Math.round(
                            (video?.ratings as number[]).reduce(
                              (a, b) => a + b,
                              0,
                            ) / (video?.ratings as number[]).length,
                          ) || 0) > 3
                            ? "warning"
                            : "medium"
                        }
                      />
                      <IonIcon
                        ios={star}
                        md={starSharp}
                        color={
                          (Math.round(
                            (video?.ratings as number[]).reduce(
                              (a, b) => a + b,
                              0,
                            ) / (video?.ratings as number[]).length,
                          ) || 0) > 4
                            ? "warning"
                            : "medium"
                        }
                      />
                      (
                      {Math.round(
                        (video?.ratings as number[]).reduce(
                          (a, b) => a + b,
                          0,
                        ) / (video?.ratings as number[]).length,
                      ) || "0"}
                      )
                    </div>
                  </IonCardContent>
                </IonCard>
              );
            })}
          </Grid>
          <IonInfiniteScroll
            threshold="100px"
            onIonInfinite={async (ev) => {
              if (videos.length >= videoCount) {
                ev.target.disabled = true;
              } else {
                await reload();
                ev.target.complete();
              }
            }}
          >
            <IonInfiniteScrollContent />
          </IonInfiniteScroll>
        </MobileBox>
        <AdminCreateVideoModal
          onClose={onCreateClose}
          isOpen={isCreateOpen}
          callback={() => {
            router.push(router.routeInfo.pathname);
          }}
        />
        <AdminVideoEditModal
          isOpen={isOpen}
          onClose={onClose}
          reload={reload}
          video={currentVideo}
        />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            color={"danger"}
            onClick={() => {
              onCreateOpen();
            }}
          >
            <IonIcon ios={add} md={addSharp} />
          </IonFabButton>
        </IonFab>
      </Page>
    </>
  );
}
