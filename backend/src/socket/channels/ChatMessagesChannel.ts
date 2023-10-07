/**
 * backend/src/socket/channels/ChatMessagesChannel.ts
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

export default class ChatMessagesChannel extends Channel {
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

      const chatId = data;

      const PAGE_SIZE = 50;

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

      const messages = await ChatMessageModel.find({
        chat: chat._id,
      });

      this.emit({
        messages: messages.sort((a, b) => {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }),
      });

      /*
      this.emit({
        messages: messages
          .sort((a, b) => {
            return a.createdAt.getTime() - b.createdAt.getTime();
          })
          .slice(page * PAGE_SIZE, (data.page + 1) * PAGE_SIZE),
        pages: Math.ceil(messages.length / PAGE_SIZE),
      });
       */
    });
  }

  emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
