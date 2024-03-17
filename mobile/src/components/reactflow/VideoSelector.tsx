/**
 * mobile/src/components/reactflow/VideoSelector.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.02.2024
 *
 */

import * as React from "react";
import SaveWorldModal from "../SaveWorldModal";
import { MVideo } from "../../types";
import { $$ } from "../../translations/i18n";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../../util/PopupManager";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
} from "@ionic/react";

export default function VideoSelector(props: {
  onClose: () => void;
  isOpen: boolean;
  onSelection: (
    video: MVideo & {
      _id: string;
    },
  ) => void;
}) {
  const [query, setQuery] = React.useState<string>("");

  const [videos, setVideos] = React.useState<
    (MVideo & {
      _id: string;
    })[]
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
        title: $$("control.error"),
        description: $$("pages.learn.videos.loading.error", res.payload.error),
      });
    }
  };

  useEffect(() => {
    setVideos([]);
    reload(1);
  }, [query]);

  return (
    <SaveWorldModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={$$("components.learning.graphs.select.video.title")}
    >
      <IonSearchbar
        value={query}
        onIonInput={(e) => setQuery(e.detail.value!)}
        placeholder={$$("control.search")}
        style={{
          padding: 0,
        }}
      />
      {videos.map((v) => (
        <>
          <IonCard
            onClick={() => {
              props.onSelection(v);
            }}
          >
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
    </SaveWorldModal>
  );
}
