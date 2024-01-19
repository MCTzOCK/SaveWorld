/**
 * backend/src/socket/SocketRegistry.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.23
 *
 */
import { Socket } from "socket.io";

export default class SocketRegistry {
  public static loggedIn: {
    [key: string]: {
      username: string;
      userId: string;
      admin: boolean;
      socket: Socket;
    };
  } = {};
}
