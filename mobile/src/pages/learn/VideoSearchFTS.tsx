/**
 * mobile/src/pages/learn/VideoSearchFTS.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
} from "@ionic/react";
import { REST } from "@saveworld/api-js";
import { useEffect, useState } from "react";
import PopupManager from "../../util/PopupManager";
import { Grid } from "@chakra-ui/react";

export default function VideoSearchFTS() {
  const [query, setQuery] = React.useState<string>("");

  const [videos, setVideos] = React.useState<
    {
      _id: string;
      title: string;
      description: string;
      streamUrl: string;
      thumbnailUrl: string;
      categories: string[];
    }[]
  >([]);
  const [videoCount, setVideoCount] = useState<number>(0);

  const [page, setPage] = useState(1);

  const reload = async (forcePage?: number) => {
    let p = forcePage || page;

    const res = await REST.Content.search(query, p);

    if (res.status === 200) {
      setVideoCount(res.payload.count);
      if (!forcePage) {
        setVideos([...videos, ...res.payload.videos]);
      } else {
        setPage(p + 1);
        setVideos(res.payload.videos);
      }
    } else {
      PopupManager.alert({
        title: "Fehler",
        description: "Fehler beim Laden der Videos: " + res.payload.error,
      });
    }
  };

  useEffect(() => {
    setVideos([]);
    reload(1);
  }, [query]);

  return (
    <>
      <Page title={"Suchen"}>
        <IonSearchbar
          value={query}
          onIonInput={(e) => setQuery(e.detail.value!)}
          placeholder={"Suchen..."}
        />

        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
        >
          {videos.map((v) => (
            <>
              <IonCard routerLink={"/learn?vid=" + v._id}>
                <IonCardHeader>
                  <IonCardTitle>{v.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  {v.description.length > 100
                    ? v.description.substr(0, 100) + "..."
                    : v.description}
                </IonCardContent>
              </IonCard>
            </>
          ))}
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
      </Page>
    </>
  );
}
