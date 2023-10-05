/**
 * mobile/src/components/CommunityMessagesChats.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.10.23
 *
 */

import * as React from "react";
import { Socket } from "socket.io-client";
import { useEffect } from "react";
import {
  Avatar,
  Grid,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import PopupManager from "../util/PopupManager";
import { ENDPOINT } from "../env";
import { useUserData } from "../hooks/useUserData";
import socketAuth from "../util/socketAuth";
import { useIonRouter } from "@ionic/react";

export default function CommunityMessagesChats(props: { socket: Socket }) {
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

      props.socket.emit("sw:chats.list");
    });
  }, []);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  return (
    <>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
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
                padding={2}
                alignItems={"center"}
                cursor={"pointer"}
                rounded={"md"}
                boxShadow={"xl"}
                onClick={() => {
                  router.push("/community/messages/" + chat._id);
                }}
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
                    {chat.users.find((u) => u._id !== userInfo._id)!.username}
                    <br />
                    <Text fontWeight={200} fontSize={20}>
                      {chat.lastMessagePreview
                        ? chat.lastMessagePreview.content
                        : "Neuer Chat"}
                    </Text>
                  </Heading>
                </VStack>
              </HStack>
            </>
          );
        })}
      </Grid>
    </>
  );
}
