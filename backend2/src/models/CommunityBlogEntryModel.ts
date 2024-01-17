/**
 * backend2/src/models/CommunityBlogEntryModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import mongoose, { Schema } from "mongoose";

const CommunityBlogEntryModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
    default: [],
  },
  likes: {
    type: [String],
    default: [],
    required: true,
  },
  comments: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default mongoose.models?.CommunityBlogEntry ||
  mongoose.model("CommunityBlogEntry", CommunityBlogEntryModel);
