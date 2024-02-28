/**
 * backend2/src/models/LearningGraphModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.02.2024
 *
 */

import mongoose from "mongoose";

const LearningGraphModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    unique: true,
  },
});

export default mongoose.models?.LearningGraph ||
  mongoose.model("LearningGraph", LearningGraphModel);
