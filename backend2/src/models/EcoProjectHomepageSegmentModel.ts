/**
 * backend2/src/models/EcoProjectHomepageSegmentModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import mongoose, { Schema } from "mongoose";

const EcoProjectHomepageSegmentModel = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "EcoProject",
  },
  pinned: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    required: true,
    maxlength: 25,
  },
  content: {
    type: String,
    required: false,
    default: "",
  },
  /*
   * - text (content: plain text)
   * - image (content: image url)
   * - list (content: list items separated by \0)
   */
  type: {
    type: String,
    required: true,
    default: "text",
  },
});

export default mongoose.models?.EcoProjectHomepageSegment ||
  mongoose.model("EcoProjectHomepageSegment", EcoProjectHomepageSegmentModel);
