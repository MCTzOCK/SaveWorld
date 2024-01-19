/**
 * backend/src/socket/channels/DeleteChatChannel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.10.23
 *
 */
import Channel from "./Channel";
import { Socket } from "socket.io";
import SocketRegistry from "../SocketRegistry";
import ChatModel from "../../models/ChatModel";
import ChatMessageModel from "../../models/ChatMessageModel";

export default class DeleteChatChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }
  register() {
    this.socket.on(this.channelName, async (channelId: string) => {
      if (!SocketRegistry.loggedIn[this.socket.id]) {
        this.emit({
          error: "Unauthorized",
        });
        return;
      }

      if (!channelId) {
        this.emit({
          error: "No Channel ID provided",
        });
        return;
      }

      const channel = await ChatModel.findById(channelId);

      if (
        !channel ||
        !channel.users.includes(SocketRegistry.loggedIn[this.socket.id].userId)
      ) {
        this.emit({
          error: "Channel not found",
        });
        return;
      }

      await ChatMessageModel.deleteMany({
        chat: channelId,
      });

      await channel.deleteOne();

      this.emit({
        success: true,
      });
    });
  }
  emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
