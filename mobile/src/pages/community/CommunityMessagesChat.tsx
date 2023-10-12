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
import { ENDPOINT } from "../../env";
import { IonButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";

export default function CommunityMessagesChat(props: { socket: Socket }) {
  const { id } = useParams<{ id: string }>();
  const { userInfo } = useUserData();

  const [messages, setMessages] = React.useState<
    {
      _id: string;
      content: string;
      senderId: string;
      readBy: string[];
      createdAt: string;
    }[]
  >([]);

  const [chat, setChat] = React.useState<{
    _id: string;
    users: {
      _id: string;
      username: string;
      displayName: string;
    }[];
    isGroup: boolean;
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
      props.socket.on("sw:chats.messages.create", (data: any) => {});
      props.socket.on(
        "sw:chats.messages.get",
        (data: { messages: any[]; error?: any }) => {
          if (!data.messages) {
            setTimeout(() => {
              //props.socket.emit("sw:chats.messages.get", id);
            }, 100);
            return;
          }

          if (!data.error) {
            setMessages(data.messages);
          } else {
          }
        },
      );

      props.socket.on("sw:chat.messages.new", (data: any) => {
        console.log(data);
        setMessages((old) => [...old, data.chatMessage]);
      });

      props.socket.on("sw:chats.groups.add.member", (data) => {
        if (data.error) {
          PopupManager.alert({
            title: "Fehler",
            description: data.error,
          });
        } else {
          PopupManager.alert({
            title: "Erfolg",
            description: "Der Benutzer wurde erfolgreich hinzugefügt.",
          });
        }
      });

      props.socket.emit("sw:chats.get", id);
      props.socket.emit("sw:chats.messages.get", id);
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
      <Page
        title={chat.users
          .map((u) =>
            u.username !== userInfo.username ? u.username : undefined,
          )
          .filter((x) => x !== undefined)
          .join(",")}
        endButtons={
          <>
            {chat.isGroup ? (
              <IonButton
                style={{
                  "--color": "var(--ion-color-success-shade)",
                }}
                onClick={async () => {
                  const username = await PopupManager.promptAsync({
                    title: "Benutzer hinzufügen",
                    helperText: "Gib den Benutzernamen des Benutzers ein",
                    inputType: "INPUT",
                  });

                  if (!username) return;

                  props.socket.emit("sw:chats.groups.add.member", {
                    groupId: id,
                    username: username,
                  });
                }}
              >
                <IonIcon icon={add} />
              </IonButton>
            ) : null}
          </>
        }
      >
        <ChatContainer>
          <ChatMessageList>
            {messages
              // remove duplicates (by _id)
              .filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i)
              .sort((a, b) => {
                if (new Date(a.createdAt) > new Date(b.createdAt)) {
                  return 1;
                } else if (new Date(a.createdAt) < new Date(b.createdAt)) {
                  return -1;
                } else {
                  return 0;
                }
              })
              .map((m) => (
                <>
                  <ChatMessage
                    content={m.content}
                    type={m.senderId === userInfo._id ? "out" : "in"}
                    timestamp={new Date(m.createdAt).toLocaleString()}
                    sender={{
                      name: "",
                      avatar: ENDPOINT + "/media/profile-picture/" + m.senderId,
                    }}
                    read={false}
                  />
                </>
              ))}
          </ChatMessageList>
          <ChatMessageInput
            onSubmit={(v: string) => {
              props.socket.emit("sw:chats.messages.create", {
                chatId: id,
                content: v,
              });
            }}
          />
        </ChatContainer>
      </Page>
    </>
  );
}
