/**
 * mobile/src/components/chat/ChatContainer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.23
 *
 */
import React from "react";
import "../../theme/chat-ui.scss";

export default function ChatContainer(props: { children: React.ReactNode }) {
  return (
    <div className={"chat chat-wrapper chat-component"}>{props.children}</div>
  );
}
