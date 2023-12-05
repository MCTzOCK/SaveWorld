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
import { REST } from "@saveworld/api-js";
import {
  IonActionSheet,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSearchbar,
  IonSpinner,
  IonText,
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

export default function Channel() {
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

    REST.Content.categories().then((res) => {
      if (res.status === 200) {
        setChannel(
          (res.payload as any).filter((e: any) => e._id === id)[0] || null,
        );
      }
    });
  };

  useEffect(() => {
    reloadVideos();
  }, [videoQuery]);

  const reloadVideos = async () => {
    const res = await REST.Content.searchCategory(id, videoQuery);
    if (res.status === 200) {
      setVideos(res.payload.videos);
    } else {
      PopupManager.alert({
        title: "Fehler",
        description: "Fehler beim Laden der Videos: " + res.payload.error,
      });
    }
  };

  return (
    <>
      <Page title={channel ? channel.name : "Laden..."}>
        {channel ? (
          <>
            <MobileBox>
              <div>
                <Image
                  alt={"Banner"}
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
                <Box mt={["1rem", "3rem"]} mb={"2rem"}>
                  <IonText>
                    <h1
                      style={{
                        textAlign: "center",
                      }}
                    >
                      Videos
                    </h1>
                  </IonText>
                  <hr
                    style={{
                      backgroundColor: "var(--ion-color-success-shade)",
                    }}
                  />
                  <IonSearchbar
                    placeholder={"Video suchen"}
                    style={{
                      padding: 0,
                    }}
                    onIonInput={(e) => {
                      setVideoQuery(e.detail.value!);
                    }}
                  />
                </Box>
                {videos.map((v) => {
                  return (
                    <>
                      <Card
                        bg={"gray.800"}
                        as={Link}
                        href={"/learn?vid=" + v._id}
                      >
                        <CardHeader>
                          <Text fontSize={"xl"}>{v.title}</Text>
                          <Text fontSize={"lg"}>{v.description}</Text>
                        </CardHeader>
                      </Card>
                    </>
                  );
                })}
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
