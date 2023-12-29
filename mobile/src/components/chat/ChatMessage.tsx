/**
 * mobile/src/components/chat/ChatMessage.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.23
 *
 */
import { Avatar, Image, Text } from "@chakra-ui/react";
import { ENDPOINT } from "../../env";

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
            {props.content.startsWith("image:\0") ? (
              <Image
                w={"100%"}
                maxW={"300px"}
                src={ENDPOINT + props.content.split("\0")[1]}
                rounded={"lg"}
              />
            ) : (
              <Text fontSize={"md"}>{props.content}</Text>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
