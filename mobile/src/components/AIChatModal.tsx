/**
 * mobile/src/components/AIChatModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.01.2024
 *
 */

import * as React from "react";
import { Modal } from "@chakra-ui/react";
import SaveWorldModal from "./SaveWorldModal";
import ChatContainer from "./chat/ChatContainer";
import ChatMessageList from "./chat/ChatMessageList";
import ChatMessage from "./chat/ChatMessage";
import { ENDPOINT } from "../env";
import ChatMessageInput from "./chat/ChatMessageInput";
import { useEffect } from "react";
import { $$ } from "../translations/i18n";
import { useUserData } from "../hooks/useUserData";

export default function AIChatModal(props: {
  onClose: () => void;
  isOpen: boolean;
  messages: {
    role: string;
    content: string;
  }[];
  onSend: (message: string) => void;
}) {
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, [props.messages]);

  const { userInfo } = useUserData();

  return (
    <>
      <SaveWorldModal
        title={"AI Chat"}
        isOpen={props.isOpen}
        onClose={props.onClose}
        customSize={"full"}
      >
        <ChatContainer>
          <ChatMessageList>
            {props.messages.map((m) => (
              <>
                <ChatMessage
                  content={m.content}
                  type={m.role === "user" ? "out" : "in"}
                  timestamp={""}
                  sender={{
                    name: "",
                    avatar:
                      m.role === "user"
                        ? ENDPOINT +
                          "/media/profile-picture-username/" +
                          userInfo.username
                        : "https://saveworld.one/logo.png",
                  }}
                  read={false}
                />
              </>
            ))}
            {loading && (
              <ChatMessage
                content={$$("pages.ai.thinking")}
                type={"in"}
                timestamp={""}
                sender={{
                  name: "",
                  avatar: "https://saveworld.one/logo.png",
                }}
                read={false}
              />
            )}
          </ChatMessageList>
          <ChatMessageInput
            onSubmit={(v: string) => {
              setLoading(true);
              props.onSend(v);
            }}
            onImage={(url: string) => {}}
            noMedia
          />
        </ChatContainer>
      </SaveWorldModal>
    </>
  );
}
