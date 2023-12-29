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
import {
  Box,
  Heading,
  IconButton,
  Link,
  useMediaQuery,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import MobileBox from "../../components/MobileBox";

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
            <IconButton
              aria-label={"Suchen"}
              as={Link}
              href={"/learn/fts-search"}
              icon={<FaSearch />}
              color={"brand.500"}
              variant={"ghost"}
              size={"lg"}
            />
          </>
        }
      >
        <MobileBox>
          <div {...swipeHandlers}>
            <Box
              overflow={"hidden"}
              aspectRatio={"9/16"}
              maxW={["100%", "100%", "50%"]}
            >
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
                style={{
                  maxHeight: "50vh",
                }}
                playsInline={true}
              />
            </Box>
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
        </MobileBox>
        <VideoDetailsModal modal={modal} video={video} />
      </Page>
    </>
  );
}
