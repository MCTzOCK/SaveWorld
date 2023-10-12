/**
 * mobile/src/pages/community/CommunityMessagesChatsList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.10.2023
 *
 */

import * as React from "react";
import { useUserData } from "../../hooks/useUserData";
import { IonSegment, IonSegmentButton, useIonRouter } from "@ionic/react";
import { useEffect } from "react";
import socketAuth from "../../util/socketAuth";
import PopupManager from "../../util/PopupManager";
import {
  Avatar,
  Box,
  Grid,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import { ENDPOINT } from "../../env";
import { FaTrash } from "react-icons/fa6";
import { Socket } from "socket.io-client";
import Page from "../../components/Page";

export default function CommunityMessagesChatsList(props: { socket: Socket }) {
  const { userInfo } = useUserData();
  const router = useIonRouter();

  const [chats, setChats] = React.useState<
    {
      _id: string;
      users: {
        _id: string;
        username: string;
        displayName: string;
      }[];
      lastMessagePreview: {
        _id: string;
        content: string;
        createdAt: Date;
        senderId: string;
        readBy: string[];
      };
    }[]
  >([]);

  useEffect(() => {
    socketAuth(props.socket, () => {
      props.socket.on("sw:chats.list", (data: any) => {
        if (data.for === "groups") return;

        if (!data.chats) {
          setTimeout(() => {
            props.socket.emit("sw:chats.list");
          }, 100);
          return;
        }

        if (data.error) {
          if (data.error === "Unauthorized") {
            // TODO: Fix multiple unnecessary requests
          } else {
            PopupManager.alert({
              title: "Fehler",
              description: data.error,
            });
          }
        } else {
          setChats(data.chats);
        }
      });

      props.socket.on("sw:chats.create", (data: any) => {
        if (data.error) {
          PopupManager.alert({
            title: "Fehler",
            description: data.error,
          });
        } else {
          props.socket.emit("sw:chats.list");
        }
      });

      props.socket.on("sw:chats.delete", (data: any) => {
        if (data.error) {
          PopupManager.alert({
            title: "Fehler",
            description: data.error,
          });
        } else {
          props.socket.emit("sw:chats.list");
        }
      });

      props.socket.emit("sw:chats.list");
    });
    return () => {
      props.socket.off("sw:chats.list");
      props.socket.off("sw:chats.create");
      props.socket.off("sw:chats.delete");
    };
  }, []);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  return (
    <>
      <Page title={"Nachrichten"}>
        <IonSegment
          value={"chats"}
          onIonChange={(e) => {
            router.push("/community/messages-groups", "none", "replace");
          }}
        >
          <IonSegmentButton value="chats">Chats</IonSegmentButton>
          <IonSegmentButton value="groups">Gruppen</IonSegmentButton>
        </IonSegment>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
          pt={4}
          gap={[2, 4]}
        >
          <HStack
            spacing={4}
            w={"100%"}
            bgColor={"rgba(120, 227, 162, .6)"}
            padding={2}
            alignItems={"center"}
            cursor={"pointer"}
            rounded={"md"}
            boxShadow={"xl"}
            onClick={async () => {
              const username = await PopupManager.promptAsync({
                title: "Neuer Chat",
                helperText: "Gib den Benutzernamen des anderen Nutzers ein",
                inputType: "INPUT",
              });

              if (!username) return;

              if (username === userInfo.username) {
                PopupManager.alert({
                  title: "Fehler",
                  description: "Du kannst nicht mit dir selbst chatten",
                });
                return;
              }

              props.socket.emit("sw:chats.create", username);
            }}
          >
            <IconButton
              aria-label={"Neuer Chat"}
              icon={<FaPlusCircle fontSize={35} />}
              variant={"ghost"}
              size={"lg"}
            />
            <VStack alignItems={"center"} justifyContent={"center"}>
              <Heading>
                Neuer Chat
                <br />
                <Text fontWeight={200} fontSize={20}>
                  Erstelle einen neuen Chat
                </Text>
              </Heading>
            </VStack>
          </HStack>
          {chats.map((chat) => {
            return (
              <>
                <HStack
                  spacing={4}
                  w={"100%"}
                  bgColor={"rgba(120, 227, 162, .3)"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  rounded={"md"}
                  boxShadow={"xl"}
                >
                  <HStack
                    onClick={() => {
                      router.push("/community/messages/" + chat._id);
                    }}
                    cursor={"pointer"}
                    w={"100%"}
                    p={2}
                  >
                    <Avatar
                      src={
                        ENDPOINT +
                        "/media/profile-picture-username/" +
                        chat.users.find((u) => u._id !== userInfo._id)!.username
                      }
                    />
                    <VStack alignItems={"center"} justifyContent={"center"}>
                      <Heading>
                        {
                          chat.users.find((u) => u._id !== userInfo._id)!
                            .username
                        }
                        <br />
                        <Text fontWeight={200} fontSize={20}>
                          {chat.lastMessagePreview
                            ? chat.lastMessagePreview.content
                            : "Neuer Chat"}
                        </Text>
                      </Heading>
                    </VStack>
                  </HStack>
                  <Box
                    zIndex={12}
                    bg={"rgba(255,0,0,1)"}
                    h={"100%"}
                    roundedRight={"md"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    display={"flex"}
                    p={4}
                    cursor={"pointer"}
                    onClick={async () => {
                      if (
                        !(await PopupManager.confirmAsync({
                          title: "Chat löschen",
                          question: "Möchtest du diesen Chat wirklich löschen?",
                        }))
                      )
                        return;
                      props.socket.emit("sw:chats.delete", chat._id);
                    }}
                  >
                    <FaTrash fontSize={30} />
                  </Box>
                </HStack>
              </>
            );
          })}
        </Grid>
      </Page>
    </>
  );
}
