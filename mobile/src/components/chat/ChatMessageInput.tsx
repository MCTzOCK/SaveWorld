/**
 * mobile/src/components/chat/ChatMessageInput.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.23
 *
 */
import { IconButton, Input } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa6";

export default function ChatMessageInput(props: {
  onSubmit: (message: string) => void;
}) {
  return (
    <div className={"chat-component chat-message-input-wrapper"}>
      <div className={"chat-component chat-message-input"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement).elements.namedItem(
              "message",
            ) as HTMLInputElement;

            if (!input || !input.value) return;

            props.onSubmit(input.value);
            input.value = "";
          }}
        >
          <Input
            type={"text"}
            name={"message"}
            placeholder={"Nachricht"}
            colorScheme={"saveworld_green"}
          />
          <IconButton
            aria-label={"senden"}
            icon={<FaPaperPlane />}
            colorScheme={"saveworld_green"}
            type={"submit"}
          />
        </form>
      </div>
    </div>
  );
}
