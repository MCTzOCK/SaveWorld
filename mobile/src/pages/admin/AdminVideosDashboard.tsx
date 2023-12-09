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
import { add, addSharp } from "ionicons/icons";
import AdminCreateVideoModal from "../../components/AdminCreateVideoModal";
import PopupManager from "../../util/PopupManager";
import { Grid, UnorderedList, useDisclosure } from "@chakra-ui/react";
import MobileBox from "../../components/MobileBox";
import AdminVideoEditModal from "../../components/AdminVideoEditModal";

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
  }>({
    _id: "",
    title: "",
    description: "",
    streamUrl: "",
    thumbnailUrl: "",
    categories: [],
    sources: [],
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
        title: "Fehler",
        description: "Fehler beim Laden der Videos: " + res.payload.error,
      });
    }
  };
  useEffect(() => {
    reload();
  }, []);

  const modal = React.useRef<HTMLIonModalElement>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Page title={"Videos"} redGradient>
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
                    <IonText>{video.description.slice(0, 150)}</IonText>
                    <br />
                    <br />
                    {video.streamUrl}
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
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton
              color={"danger"}
              onClick={() => {
                modal.current?.present();
              }}
            >
              <IonIcon ios={add} md={addSharp} />
            </IonFabButton>
          </IonFab>
        </MobileBox>
        <AdminCreateVideoModal
          modal={modal}
          callback={() => {
            window.location.reload();
          }}
        />
        <AdminVideoEditModal
          isOpen={isOpen}
          onClose={onClose}
          reload={reload}
          video={currentVideo}
        />
      </Page>
    </>
  );
}
