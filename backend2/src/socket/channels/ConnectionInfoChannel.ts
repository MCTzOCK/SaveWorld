/**
 * backend/src/socket/channels/ConnectionInfoChannel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.23
 *
 */
import Channel from "./Channel";
import { Socket } from "socket.io";
import SocketRegistry from "../SocketRegistry";

export default class ConnectionInfoChannel extends Channel {
  constructor(socket: Socket, channelName: string) {
    super(socket, channelName);
  }

  register() {
    this.socket.on(this.channelName, async (data) => {
      this.emit({
        loggedIn: SocketRegistry.loggedIn[this.socket.id] !== undefined,
        username: SocketRegistry.loggedIn[this.socket.id]
          ? SocketRegistry.loggedIn[this.socket.id].username
          : undefined,
      });
    });
  }

  emit(data: any) {
    this.socket.emit(this.channelName, data);
  }
}
