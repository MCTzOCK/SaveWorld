/**
 * mobile/src/components/chat/ChatMessageList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.23
 *
 */

import React from "react";

export default function ChatMessageList(props: { children: React.ReactNode }) {
  return (
    <div className={"chat-component chat-message-list"}>{props.children}</div>
  );
}
