/**
 * mobile/src/pages/learn/Channel.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js/index";
import {
  IonActionSheet,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSearchbar,
  IonSpinner,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { useParams } from "react-router";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import MobileBox from "../../components/MobileBox";
import { ENDPOINT } from "../../env";
import {
  map,
  mapSharp,
  menu,
  menuSharp,
  people,
  peopleSharp,
  trophy,
  trophySharp,
  videocam,
} from "ionicons/icons";
import PopupManager from "../../util/PopupManager";
import CommunityProfileBlogList from "../../components/CommunityProfileBlogList";
import { $$ } from "../../translations/i18n";
import { translateOnlineV3 } from "../../util/online-translate";

export default function Channel() {
  const router = useIonRouter();

  const { id } = useParams<{ id: string }>();
  const [videoQuery, setVideoQuery] = useState<string>("");

  const [channel, setChannel] = useState<{
    _id: string;
    name: string;
    description: string;
    image: string;
  } | null>(null);
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

  useEffect(() => {
    reload();
    reloadVideos();
  }, [id]);

  const reload = () => {
    if (!id) return;

    REST.Content.categories().then(async (res) => {
      if (res.status === 200) {
        const cats =
          (res.payload as any).filter((e: any) => e._id === id)[0] || null;

        if (window.language !== "de") {
          cats.name = await translateOnlineV3({
            text: cats.name,
            to: window.language,
          });
          cats.description = await translateOnlineV3({
            text: cats.description,
            to: window.language,
          });
        }

        setChannel(cats);
      }
    });
  };

  useEffect(() => {
    reloadVideos();
  }, [videoQuery]);

  const reloadVideos = async () => {
    const res = await REST.Content.searchCategory(id, videoQuery);
    if (res.status === 200) {
      const videos = res.payload.videos as any;

      if (window.language !== "de") {
        for (const v of videos) {
          v.title = await translateOnlineV3({
            text: v.title,
            to: window.language,
          });
          v.description = await translateOnlineV3({
            text: v.description,
            to: window.language,
          });
        }
      }

      setVideos(res.payload.videos);
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$("pages.learn.videos.loading.error", res.payload.error),
      });
    }
  };

  return (
    <>
      <Page title={channel ? channel.name : $$("general.loading")}>
        {channel ? (
          <>
            <MobileBox>
              <div>
                <Image
                  alt={$$("pages.community.profile.banner")}
                  src={channel.image}
                  rounded={"md"}
                  style={{
                    aspectRatio: "16/9",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
                <IonCard
                  style={{
                    marginTop: "-20%",
                    "--background": "rgba(20,20,20,0.85)",
                    boxShadow: "0 0 10px rgba(0,155,0,0.5)",
                  }}
                >
                  <IonCardContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <IonText color={"dark"}>
                        <h1>{channel.name}</h1>
                      </IonText>
                    </div>
                    <div
                      style={{
                        paddingTop: "12px",
                      }}
                    >
                      <IonText>
                        <h3>{channel.description}</h3>
                      </IonText>
                    </div>
                  </IonCardContent>
                </IonCard>
                <Box mt={["2rem", "4rem"]} mb={"2rem"}>
                  <IonText>
                    <h1
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {$$("menu.videos")}
                    </h1>
                  </IonText>
                  <hr
                    style={{
                      backgroundColor: "var(--ion-color-success-shade)",
                    }}
                  />
                  <IonSearchbar
                    placeholder={$$("control.search")}
                    style={{
                      padding: 0,
                    }}
                    onIonInput={(e) => {
                      setVideoQuery(e.detail.value!);
                    }}
                  />
                </Box>
                <VStack gap={4}>
                  {videos.map((v) => {
                    return (
                      <>
                        <Card
                          w={"100%"}
                          bg={"gray.800"}
                          as={Link}
                          href={"/learn?vid=" + v._id}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push("/learn?vid=" + v._id);
                          }}
                        >
                          <CardHeader>
                            <Text fontSize={"xl"}>{v.title}</Text>
                            <Text fontSize={"lg"}>{v.description}</Text>
                          </CardHeader>
                        </Card>
                      </>
                    );
                  })}
                </VStack>
              </div>
            </MobileBox>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "50vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonSpinner />
            </div>
          </>
        )}
      </Page>
    </>
  );
}
