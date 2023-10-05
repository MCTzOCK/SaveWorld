/**
 * mobile/src/util/socketAuth.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.10.23
 *
 */
import { Socket } from "socket.io-client";

export default function socketAuth(socket: Socket, callback: () => void) {
  socket.on("sw:auth.authenticate", (data) => {
    console.log("SCKT Authenticate Response: " + JSON.stringify(data));
    callback();
  });

  socket.emit("sw:auth.authenticate", localStorage.getItem("token") as string);
}
