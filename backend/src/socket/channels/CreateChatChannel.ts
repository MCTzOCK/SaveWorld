/**
 * backend/src/socket/channels/CreateChatChannel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.10.23
 *
 */
import { Socket } from "socket.io";
import Channel from "./Channel";
import SocketRegistry from "../SocketRegistry";
import ChatModel from "../../models/ChatModel";
import UserModel from "../../models/UserModel";

export default class CreateChatChannel extends Channel {
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

      const otherUsername = data;
      const otherUserDoc = await UserModel.findOne({
        username: otherUsername,
      });

      if (!otherUserDoc) {
        this.emit({
          error: "User not found",
        });
        return;
      }

      // TODO: Block Logic

      const existingChat = await ChatModel.findOne({
        users: {
          $all: [
            SocketRegistry.loggedIn[this.socket.id].userId,
            otherUserDoc._id,
          ],
        },
      });

      if (existingChat) {
        this.emit({
          chatId: existingChat._id,
        });
        return;
      }

      const chat = await ChatModel.create({
        users: [
          SocketRegistry.loggedIn[this.socket.id].userId,
          otherUserDoc._id,
        ],
      });

      this.emit({
        chatId: chat._id,
      });
    });
  }

  emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
