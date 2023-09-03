/**
 * backend/src/models/VideoModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.08.2023
 *
 */
import mongoose from "mongoose";

const VideoModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  streamUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  s3ObjectName: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.Video || mongoose.model("Video", VideoModel);
