/**
 * backend2/src/models/SupportRequestModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import mongoose from "mongoose";

const SupportRequestModel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  // REPORT-USER, REPORT-POST, REPORT-BUG, GENERAL
  category: {
    type: String,
    required: true,
  },
  additionalData: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  processed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.models?.SupportRequest ||
  mongoose.model("SupportRequest", SupportRequestModel);
