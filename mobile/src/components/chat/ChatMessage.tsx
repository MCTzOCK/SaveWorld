/**
 * mobile/src/components/chat/ChatMessage.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.23
 *
 */
import { Avatar, Text } from "@chakra-ui/react";

export default function ChatMessage(props: {
  content: string;
  type: "in" | "out";
  timestamp: string;
  sender: {
    name: string;
    avatar: string;
  };
  read: boolean;
}) {
  return (
    <>
      <div className={"chat-component chat-message chat-message-" + props.type}>
        <div className={"chat-message-sender"}>
          <Avatar src={props.sender.avatar} size={"sm"} />
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {props.sender.name}
          </Text>
        </div>
        <div className={"chat-message-box"}>
          <div className="chat-message-timestamp">
            <Text fontSize={"sm"}>{props.timestamp}</Text>
          </div>
          <div className="chat-message-content">
            <Text fontSize={"md"}>{props.content}</Text>
          </div>
        </div>
      </div>
    </>
  );
}
