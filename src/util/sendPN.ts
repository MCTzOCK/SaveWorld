/**
 * backend/src/util/sendPN.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */
import { getOS } from "./getOS";
import PushNotificationModel from "../models/PushNotificationModel";

export async function sendPN(opts: {
  title: string;
  content: string;
  user_ids: string[];
  launch_url?: string;
}) {
  const client = getOS();

  const notification = await client.createNotification({
    contents: {
      en: opts.content,
    },
    headings: {
      en: opts.title,
    },
    included_segments: ["All"],
    app_id: process.env.ONE_SIGNAL_USER_KEY,
    url: opts.launch_url,
    include_external_user_ids: opts.user_ids,
  });

  for (const id of opts.user_ids) {
    const mNotification = PushNotificationModel.create({
      user: id,
      title: opts.title,
      content: opts.content,
      url: opts.launch_url,
    });
  }
}
