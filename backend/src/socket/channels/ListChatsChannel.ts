/**
 * backend/src/socket/channels/ListChatsChannel.ts
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

export default class ListChatsChannel extends Channel {
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

      console.log(data);

      const onlyGroups = data === "groups";

      const chats = await ChatModel.find({
        users: {
          $in: [SocketRegistry.loggedIn[this.socket.id].userId],
        },
        isGroup: onlyGroups,
      });

      let returnChats: {
        _id: string;
        users: {
          _id: string;
          username: string;
          displayName: string;
        }[];
        lastMessagePreview: {
          _id: string;
          content: string;
          createdAt: Date;
          senderId: string;
          readBy: string[];
        };
      }[] = [];

      for (const chat of chats) {
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

        returnChats.push(chatObj);
      }

      let retObj: any = {
        for: onlyGroups ? "groups" : "chats",
      };

      if (onlyGroups) {
        retObj.groups = returnChats;
      } else {
        retObj.chats = returnChats;
      }

      this.emit(retObj);
    });
  }
  emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
