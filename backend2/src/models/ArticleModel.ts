/**
 * backend2/src/models/ArticleModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.02.2024
 *
 */

import mongoose from "mongoose";

const ArticleModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  featureImage: {
    type: String,
    required: false,
  },
  featureImageCPR: {
    type: String,
    required: false,
  },
  content: {
    type: String,
  },
  tags: {
    type: [String],
    required: false,
  },
});

export default mongoose.models?.Article ||
  mongoose.model("Article", ArticleModel);
