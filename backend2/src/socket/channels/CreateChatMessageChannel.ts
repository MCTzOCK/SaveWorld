/**
 * backend/src/socket/channels/CreateChatMessageChannel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.10.23
 *
 */
import Channel from "./Channel";
import { Socket } from "socket.io";
import SocketRegistry from "../SocketRegistry";
import ChatModel from "../../models/ChatModel";
import ChatMessageModel from "../../models/ChatMessageModel";
import { sendPN } from "../../util/sendPN";

export default class CreateChatMessageChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  register() {
    this.socket.on(this.channelName, async (data) => {
      if (!SocketRegistry.loggedIn[this.socket.id]) {
        this.emit({
          error: "Unauthorized",
        });
        return;
      }

      const { chatId, content } = data;

      if (!chatId || !content) {
        this.emit({
          error: "Missing data",
        });
        return;
      }

      const chat = await ChatModel.findById(chatId);

      if (
        !chat ||
        !chat.users.includes(SocketRegistry.loggedIn[this.socket.id].userId)
      ) {
        this.emit({
          error: "Chat not found",
        });
        return;
      }

      const chatMessage = await ChatMessageModel.create({
        content,
        chat: chat._id,
        readBy: [],
        createdAt: Date.now(),
        senderId: SocketRegistry.loggedIn[this.socket.id].userId,
      });

      this.emit({
        message: "Message created",
        chatMessage,
      });

      Object.values(SocketRegistry.loggedIn).forEach((v) => {
        if (!chat.users.includes(v.userId)) return;

        v.socket.emit("sw:chat.messages.new", {
          chatId,
          chatMessage,
        });

        if (v.userId !== SocketRegistry.loggedIn[this.socket.id].userId) {
          sendPN({
            title:
              "Nachricht von: " +
              SocketRegistry.loggedIn[this.socket.id].username,
            content: chatMessage.content,
            launch_url: `https://app.saveworld.one/community/messages/${chatMessage.chat}`,
            user_ids: [v.userId],
          });
        }
      });
    });
  }
  emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
