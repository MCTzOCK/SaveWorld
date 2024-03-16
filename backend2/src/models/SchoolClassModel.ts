/**
 * backend2/src/models/SchoolClassModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.03.2024
 *
 */

import mongoose from "mongoose";

const SchoolClassModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
    default: [],
  },
  permissions: {
    type: Array,
    required: true,
    default: [],
  },
  homepage: {
    type: String,
    required: true,
    default: JSON.stringify(["saveworld.default.homepage"]),
  },
});

export default mongoose.models?.SchoolClass ||
  mongoose.model("SchoolClass", SchoolClassModel);
