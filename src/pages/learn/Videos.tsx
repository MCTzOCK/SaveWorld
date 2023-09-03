/**
 * mobile/src/pages/learn/Videos.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { REST } from "@saveworld/api-js";
import { useEffect, useRef } from "react";
import { ENDPOINT } from "../../env";
import Plyr, { APITypes, PlyrInstance } from "plyr-react";
import "plyr-react/plyr.css";
import { IonButton, IonIcon, IonText } from "@ionic/react";
import {
  ellipsisHorizontalCircle,
  ellipsisHorizontalCircleSharp,
} from "ionicons/icons";
import { useSwipeable } from "react-swipeable";
import VideoDetailsModal from "../../components/VideoDetailsModal";

export default function Videos() {
  useRedirectForAnon();

  const modal = React.useRef<HTMLIonModalElement>(null);

  const [video, setVideo] = React.useState<{
    _id: string;
    title: string;
    description: string;
    streamUrl: string;
    thumbnailUrl: string;
    categories: string[];
    s3ObjectName: string;
  } | null>(null);

  const nextVideo = async () => {
    const res = await REST.Content.nextVideo(
      localStorage.getItem("token") as string,
    );
    if (res.status === 200) {
      if (video) {
        REST.Content.addVideoToHistory(
          localStorage.getItem("token") as string,
          video._id,
        );
      }

      setVideo(res.payload.video);
    } else {
      alert("Fehler beim Laden des nächsten Videos");
    }
  };

  useEffect(() => {
    nextVideo();
  }, []);

  const videoRef = useRef<APITypes | null>(null);

  const swipeHandlers = useSwipeable({
    onSwipedUp: (eventData) => {
      nextVideo();
    },
    trackMouse: true,
    trackTouch: true,
    swipeDuration: Infinity,
    delta: 5,
  });

  return (
    <>
      <Page title={"Lernen"} noPadding>
        <div {...swipeHandlers}>
          <Plyr
            ref={videoRef}
            onEnded={() => {
              console.log("123");
            }}
            source={{
              type: "video",
              sources: [
                {
                  provider: "html5",
                  src: ENDPOINT + video?.streamUrl,
                },
              ],
            }}
            options={{
              autoplay: true,
              fullscreen: {
                enabled: false,
              },
              hideControls: true,
              controls: [],
              loop: {
                active: true,
              },
              clickToPlay: true,
            }}
          />
          <div
            style={{
              position: "fixed",
              bottom: "0%",
              left: "0%",
              width: "100%",
              height: "7.5vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IonText>{video?.title}</IonText>
            <IonButton
              fill={"clear"}
              onClick={() => {
                modal.current?.present();
              }}
            >
              <IonIcon
                ios={ellipsisHorizontalCircle}
                md={ellipsisHorizontalCircleSharp}
              />
            </IonButton>
          </div>
        </div>
        <VideoDetailsModal modal={modal} video={video} />
      </Page>
    </>
  );
}
