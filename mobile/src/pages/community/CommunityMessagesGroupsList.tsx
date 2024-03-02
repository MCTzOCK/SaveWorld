/**
 * mobile/src/pages/community/CommunityMessagesGroupsList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.10.2023
 *
 */

import * as React from "react";
import { Socket } from "socket.io-client";
import { useUserData } from "../../hooks/useUserData";
import { IonSegment, IonSegmentButton, useIonRouter } from "@ionic/react";
import { useEffect } from "react";
import socketAuth from "../../util/socketAuth";
import PopupManager from "../../util/PopupManager";
import {
  Box,
  Grid,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";

export default function CommunityMessagesGroupsList(props: { socket: Socket }) {
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
        if (data.for === "chats") return;
        if (!data.groups) {
          setTimeout(() => {
            props.socket.emit("sw:chats.list", "groups");
          }, 100);
          return;
        }

        if (data.error) {
          if (data.error === "Unauthorized") {
            // TODO: Fix multiple unnecessary requests
          } else {
            PopupManager.alert({
              title: $$("control.error"),
              description: data.error,
            });
          }
        } else {
          setChats(data.groups);
        }
      });

      props.socket.on("sw:chats.create", (data: any) => {
        if (data.error) {
          PopupManager.alert({
            title: $$("control.error"),
            description: data.error,
          });
        } else {
          props.socket.emit("sw:chats.list", "groups");
        }
      });

      props.socket.on("sw:chats.delete", (data: any) => {
        if (data.error) {
          PopupManager.alert({
            title: $$("control.error"),
            description: data.error,
          });
        } else {
          props.socket.emit("sw:chats.list", "groups");
        }
      });

      props.socket.emit("sw:chats.list", "groups");
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
      <Page title={$$("pages.community.messages")}>
        <IonSegment
          value={"groups"}
          onIonChange={(e) => {
            router.push("/community/messages", "forward", "push");
          }}
        >
          <IonSegmentButton value="chats">
            {$$("pages.community.messages.chats")}
          </IonSegmentButton>
          <IonSegmentButton value="groups">
            {$$("pages.community.messages.groups")}
          </IonSegmentButton>
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
                title: $$("pages.community.messages.groups.create"),
                helperText: $$(
                  "pages.community.messages.groups.create.description",
                ),
                inputType: "INPUT",
              });

              if (!username) return;

              if (username === userInfo.username) {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$(
                    "pages.community.messages.groups.create.error.self",
                  ),
                });
                return;
              }

              props.socket.emit("sw:chats.create", "group," + username);
            }}
          >
            <IconButton
              aria-label={$$("pages.community.messages.groups.create")}
              icon={<FaPlusCircle fontSize={35} />}
              variant={"ghost"}
              size={"lg"}
            />
            <VStack alignItems={"center"} justifyContent={"center"}>
              <Heading>
                {$$("pages.community.messages.groups.create")}
                <br />
                <Text fontWeight={200} fontSize={20}>
                  {$$("pages.community.messages.groups.create.subline")}
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
                    <VStack alignItems={"center"} justifyContent={"center"}>
                      <Heading>
                        {$$("pages.community.messages.group")}
                        <br />
                        <Text fontWeight={200} fontSize={20}>
                          {chat.lastMessagePreview
                            ? chat.lastMessagePreview.content
                            : $$("pages.community.messages.groups.create")}
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
                          title: $$("pages.community.messages.chats.delete"),
                          question: $$(
                            "pages.community.messages.chats.delete.confirm",
                          ),
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
