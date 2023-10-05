/**
 * backend/src/models/ChatMessageModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.10.23
 *
 */
import mongoose, { Schema } from "mongoose";

const ChatMessageModel = new mongoose.Schema({
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    default: [],
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  readBy: {
    type: [String],
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Chat",
  },
});

export default mongoose.models?.ChatMessage ||
  mongoose.model("ChatMessage", ChatMessageModel);
