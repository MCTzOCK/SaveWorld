/**
 * mobile/src/components/chat/ChatMessageInput.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.23
 *
 */
import { Flex, IconButton, Input, Textarea } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { uploadImage } from "../../util/files";
import { $$ } from "../../translations/i18n";

export default function ChatMessageInput(props: {
  onSubmit: (message: string) => void;
  onImage: (url: string) => void;
  noMedia?: boolean;
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
          <Textarea
            name={"message"}
            placeholder={$$("components.chat.message.box.placeholder")}
            colorScheme={"brand"}
          />
          <Flex w={"fit-content"} direction={"column"}>
            <IconButton
              aria-label={$$("components.chat.message.send")}
              icon={<FaPaperPlane />}
              color={"brand.500"}
              variant={"ghost"}
              type={"submit"}
            />
            <IconButton
              aria-label={$$("components.chat.message.add.image")}
              icon={<FaImage />}
              color={"brand.500"}
              variant={"ghost"}
              display={props.noMedia ? "none" : "flex"}
              onClick={async () => {
                uploadImage((url) => {
                  props.onImage(url);
                });
              }}
            />
          </Flex>
        </form>
      </div>
    </div>
  );
}
