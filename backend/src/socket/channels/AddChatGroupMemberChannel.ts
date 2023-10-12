/**
 * backend/src/socket/channels/AddChatGroupMemberChannel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.10.2023
 *
 */
import Channel from "./Channel";
import { Socket } from "socket.io";
import SocketRegistry from "../SocketRegistry";
import UserModel from "../../models/UserModel";
import UserPreferencesModel from "../../models/UserPreferencesModel";
import ChatModel from "../../models/ChatModel";

export default class AddChatGroupMemberChannel extends Channel {
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

      const { groupId, username } = data;

      if (!groupId || !username) {
        this.emit({
          error: "Missing data",
        });
        return;
      }

      const otherUserDoc = await UserModel.findOne({
        username: username,
      });
      const otherUserPrefs = await UserPreferencesModel.findOne({
        user: otherUserDoc?._id,
      });

      if (!otherUserDoc) {
        this.emit({
          error: "User not found",
        });
        return;
      }

      if (
        otherUserPrefs?.blocked_users.includes(
          SocketRegistry.loggedIn[this.socket.id].username,
        )
      ) {
        this.emit({
          error: "User not found",
        });
        return;
      }

      const chat = await ChatModel.findById(groupId);

      if (
        !chat ||
        !chat.users.includes(SocketRegistry.loggedIn[this.socket.id].userId)
      ) {
        this.emit({
          error: "Chat not found",
        });
        return;
      }

      if (chat.users.includes(otherUserDoc._id)) {
        this.emit({
          error: "User already in group",
        });
        return;
      }

      chat.users.push(otherUserDoc._id);

      chat.markModified("users");

      await chat.save();

      this.emit({
        message: "User added",
        chat: chat,
      });
    });
  }
  emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
