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
  Grid,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaPlusCircle } from "react-icons/fa";
import PopupManager from "../util/PopupManager";

export default function CommunityMessagesChats(props: { socket: Socket }) {
  const [chats, setChats] = React.useState<
    {
      users: string[];
      usernames: string[];
      lastMessage: string;
    }[]
  >([]);

  useEffect(() => {
    props.socket.on("sw:chats.list", (data: any) => {
      if (data.status === "success") setChats(data.chats);
    });

    props.socket.emit("sw:chats.list");
  }, []);

  return (
    <>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        pt={4}
        gap={[0, 2, 4]}
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
      </Grid>
    </>
  );
}
