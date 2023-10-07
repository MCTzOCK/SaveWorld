/**
 * mobile/src/pages/community/CommunityMessagesChat.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.10.23
 *
 */
import { Socket } from "socket.io-client";
import { useParams } from "react-router";
import Page from "../../components/Page";
import * as React from "react";
import { useEffect } from "react";
import socketAuth from "../../util/socketAuth";
import PopupManager from "../../util/PopupManager";
import { useUserData } from "../../hooks/useUserData";
import "../../theme/chat-ui.scss";
import ChatContainer from "../../components/chat/ChatContainer";
import ChatMessageList from "../../components/chat/ChatMessageList";
import ChatMessage from "../../components/chat/ChatMessage";
import ChatMessageInput from "../../components/chat/ChatMessageInput";

export default function CommunityMessagesChat(props: { socket: Socket }) {
  const { id } = useParams<{ id: string }>();
  const { userInfo } = useUserData();

  const [chat, setChat] = React.useState<{
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
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    socketAuth(props.socket, () => {
      props.socket.on("sw:chats.get", (data: any) => {
        if (!data.chat) {
          setTimeout(() => {
            props.socket.emit("sw:chats.get", id);
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
          setChat(data.chat);
        }
      });
      props.socket.on("sw:chats.message", (data: any) => {});
      props.socket.on("sw:chats.messages", (data: any) => {});

      props.socket.emit("sw:chats.get", id);
    });
  }, [id]);

  if (!chat) {
    return (
      <>
        <Page title={"Laden"}>Laden...</Page>
      </>
    );
  }

  return (
    <>
      <Page title={chat.users.find((u) => u._id !== userInfo._id)!.username}>
        <ChatContainer>
          <ChatMessageList>
            <ChatMessage
              content={"Hello World"}
              type={"in"}
              timestamp={new Date().toLocaleString()}
              sender={{
                name: "test",
                avatar: "https://avatars.githubusercontent.com/u/13332774",
              }}
              read={false}
            />
            <ChatMessage
              content={"Hello World 2"}
              type={"out"}
              timestamp={new Date().toLocaleString()}
              sender={{
                name: "ben",
                avatar: "https://avatars.githubusercontent.com/u/13332774",
              }}
              read={false}
            />
            <ChatMessage
              content={"Hello World 2"}
              type={"out"}
              timestamp={new Date().toLocaleString()}
              sender={{
                name: "ben",
                avatar: "https://avatars.githubusercontent.com/u/13332774",
              }}
              read={false}
            />
            <ChatMessage
              content={"Hello World 2"}
              type={"out"}
              timestamp={new Date().toLocaleString()}
              sender={{
                name: "ben",
                avatar: "https://avatars.githubusercontent.com/u/13332774",
              }}
              read={false}
            />
            <ChatMessage
              content={"Hello World 2"}
              type={"out"}
              timestamp={new Date().toLocaleString()}
              sender={{
                name: "ben",
                avatar: "https://avatars.githubusercontent.com/u/13332774",
              }}
              read={false}
            />
            <ChatMessage
              content={"Hello World 2"}
              type={"out"}
              timestamp={new Date().toLocaleString()}
              sender={{
                name: "ben",
                avatar: "https://avatars.githubusercontent.com/u/13332774",
              }}
              read={false}
            />
            <ChatMessage
              content={"Hello World 2"}
              type={"out"}
              timestamp={new Date().toLocaleString()}
              sender={{
                name: "ben",
                avatar: "https://avatars.githubusercontent.com/u/13332774",
              }}
              read={false}
            />
            <ChatMessage
              content={"Hello World 2"}
              type={"out"}
              timestamp={new Date().toLocaleString()}
              sender={{
                name: "ben",
                avatar: "https://avatars.githubusercontent.com/u/13332774",
              }}
              read={false}
            />
            <ChatMessage
              content={"Hello World 2"}
              type={"out"}
              timestamp={new Date().toLocaleString()}
              sender={{
                name: "ben",
                avatar: "https://avatars.githubusercontent.com/u/13332774",
              }}
              read={false}
            />
          </ChatMessageList>
          <ChatMessageInput onSubmit={(v: string) => {}} />
        </ChatContainer>
      </Page>
    </>
  );
}
