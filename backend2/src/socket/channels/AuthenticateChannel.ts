/**
 * backend/src/socket/channels/AuthenticateChannel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.23
 *
 */
import { Server, Socket } from "socket.io";
import Channel from "./Channel";
import SocketRegistry from "../SocketRegistry";
import { verify } from "jsonwebtoken";
import UserModel from "../../models/UserModel";

export default class AuthenticateChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  register() {
    this.socket.on(this.channelName, async (token) => {
      if (SocketRegistry.loggedIn[this.socket.id]) {
        this.emit({
          loggedIn: true,
        });
        return;
      }

      if (!verify(token, process.env.JWT_SECRET as string)) {
        this.emit({
          loggedIn: false,
        });
        return;
      }

      const user = await UserModel.findById(
        (verify(token, process.env.JWT_SECRET as string) as any).id,
      );

      if (!user || !user.active) {
        this.emit({
          loggedIn: false,
        });
        return;
      }

      SocketRegistry.loggedIn[this.socket.id] = {
        username: user.username,
        userId: user._id,
        admin: user.role === "admin",
        socket: this.socket,
      };

      this.emit({
        loggedIn: true,
      });
    });
  }
  emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
