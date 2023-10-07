/**
 * backend/src/socket/channels/GetChatChannel.ts
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
import UserModel from "../../models/UserModel";
import UserPreferencesModel from "../../models/UserPreferencesModel";
import ChatMessageModel from "../../models/ChatMessageModel";

export default class GetChatChannel extends Channel {
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
          error: "No Chat ID provided",
        });
        return;
      }

      const chat = await ChatModel.findById(channelId);

      if (
        !chat ||
        !chat.users.includes(SocketRegistry.loggedIn[this.socket.id].userId)
      ) {
        this.emit({
          error: "Chat not found",
        });
        return;
      }

      let chatObj: any = {};
      chatObj._id = chat._id;
      chatObj.users = [];

      for (const user of chat.users) {
        const userDoc = await UserModel.findById(user);
        const userPref = await UserPreferencesModel.findOne({
          user: userDoc._id,
        });
        chatObj.users.push({
          _id: user,
          username: userDoc.username,
          displayName: userPref.community_profile.displayName,
        });
      }

      const lastMessage = await ChatMessageModel.findOne({
        chat: chat._id,
      }).sort({ createdAt: -1 });

      if (lastMessage) {
        chatObj.lastMessagePreview = {
          _id: lastMessage._id,
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          senderId: lastMessage.senderId,
          readBy: lastMessage.readBy,
        };
      }

      this.emit({
        chat: chatObj,
      });
    });
  }
  emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
