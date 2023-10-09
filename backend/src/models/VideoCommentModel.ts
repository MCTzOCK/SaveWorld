/**
 * backend/src/models/VideoCommentModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.10.23
 *
 */
import mongoose from "mongoose";

const VideoCommentModel = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.models?.VideoComment ||
  mongoose.model("VideoComment", VideoCommentModel);
