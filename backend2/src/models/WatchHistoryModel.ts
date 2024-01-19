/**
 * backend2/src/models/WatchHistoryModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */
import mongoose from "mongoose";

const WatchHistoryModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  watchedAt: {
    type: Date,
    required: true,
    default: Date.now(),
    immutable: true,
  },
});

export default mongoose.models?.WatchHistory ||
  mongoose.model("WatchHistory", WatchHistoryModel);
