/**
 * backend2/src/util/sendPN.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.01.2024
 *
 */

import { getOS } from "./getOS";
import PushNotificationModel from "../models/PushNotificationModel";
//import SocketRegistry from "../socket/SocketRegistry";

export async function sendPN(opts: {
  title: string;
  content: string;
  user_ids: string[];
  launch_url?: string;
}) {
  for (const id of opts.user_ids) {
    const mNotification = PushNotificationModel.create({
      user: id,
      title: opts.title,
      content: opts.content,
      launch_url: opts.launch_url,
    });
    /*
    Object.values(SocketRegistry.loggedIn).forEach((v) => {
      console.log(id, v.userId);

      if (id.toString() == v.userId.toString()) {
        v.socket.emit("sw:notification.push", {
          title: opts.title,
          content: opts.content,
          launch_url: opts.launch_url,
        });
      }
    });*/
  }
  const client = getOS();

  const notification = await client.createNotification({
    contents: {
      en: opts.content,
    },
    headings: {
      en: opts.title,
    },
    app_id: process.env.ONE_SIGNAL_USER_KEY,
    url: opts.launch_url,
    include_external_user_ids: opts.user_ids,
  });
}
