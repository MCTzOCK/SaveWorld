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
import { useEffect, useRef } from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { REST } from "@saveworld/api-js";
import { ENDPOINT } from "../../env";
import Plyr, { APITypes } from "plyr-react";
import "plyr-react/plyr.css";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonText,
  useIonRouter,
} from "@ionic/react";
import {
  ellipsisHorizontalCircle,
  ellipsisHorizontalCircleSharp,
  search,
  searchSharp,
} from "ionicons/icons";
import { useSwipeable } from "react-swipeable";
import VideoDetailsModal from "../../components/VideoDetailsModal";
import { useLocation, useParams } from "react-router";
import PopupManager from "../../util/PopupManager";
import { Heading, useMediaQuery } from "@chakra-ui/react";

export default function Videos() {
  useRedirectForAnon();

  const location = useLocation();

  const modal = React.useRef<HTMLIonModalElement>(null);

  const [video, setVideo] = React.useState<{
    _id: string;
    title: string;
    description: string;
    streamUrl: string;
    thumbnailUrl: string;
    categories: string[];
    ratings: number[];
    sources: string[];
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
      PopupManager.alert({
        title: "Fehler",
        description: "Fehler beim Laden des nächsten Videos",
      });
    }
  };

  useEffect(() => {
    nextVideo();
  }, []);

  useEffect(() => {
    const usp = new URLSearchParams(location.search);

    if (usp.get("vid")) {
      setTimeout(() => {
        REST.Content.videoMetadata(usp.get("vid") as string).then((res) => {
          if (res.status === 200) {
            setVideo(res.payload.video);
          } else {
            PopupManager.alert({
              title: "Fehler",
              description: "Fehler beim Laden des Videos",
            });
          }
        });
      }, 1500);
    }
  }, [location]);

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

  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <Page
        title={"Lernen"}
        noPadding
        endButtons={
          <>
            <IonButton
              size={"large"}
              routerLink={"/learn/fts-search"}
              style={{
                "--color": "var(--ion-color-success-shade)",
              }}
            >
              <IonIcon ios={search} md={searchSharp} />
            </IonButton>
          </>
        }
      >
        {isDesktop ? (
          <>
            <Heading
              fontSize={["6xl", "8xl"]}
              textAlign={"center"}
              fontWeight={1000}
              style={{
                fontFamily: "Inter, sans-serif",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh",
                flexDirection: "column",
              }}
              maxWidth={"100%"}
            >
              Diese Funktion ist nur auf&nbsp;
              <span
                style={{
                  color: "var(--ion-color-success)",
                  textShadow: "0px 0px 40px rgba(0,255,0,1)",
                }}
              >
                mobilen Geräten
              </span>
              &nbsp;verfügbar!
            </Heading>
          </>
        ) : (
          <div {...swipeHandlers}>
            <Plyr
              ref={videoRef}
              source={{
                type: "video",
                sources: [
                  {
                    provider: "youtube",
                    src:
                      (video?.streamUrl ||
                        "https://www.youtube.com/embed/dQw4w9WgXcQ") +
                      "?autoplay=1",
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
                ratio: "9:16",
                clickToPlay: true,
              }}
              playsInline={true}
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
                color={"success"}
              >
                <IonIcon
                  ios={ellipsisHorizontalCircle}
                  md={ellipsisHorizontalCircleSharp}
                />
              </IonButton>
            </div>
          </div>
        )}

        <VideoDetailsModal modal={modal} video={video} />
      </Page>
    </>
  );
}
