/**
 * backend2/src/models/ChatModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.23
 *
 */
import mongoose, { Schema } from "mongoose";

const ChatModel = new mongoose.Schema({
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    default: [],
    ref: "User",
  },
  isGroup: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.models?.Chat || mongoose.model("Chat", ChatModel);
