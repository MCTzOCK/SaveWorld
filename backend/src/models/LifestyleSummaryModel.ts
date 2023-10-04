/**
 * backend/src/models/LifestyleSummaryModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.09.2023
 *
 */

import mongoose from "mongoose";

const LifestyleSummaryModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  /*
   * ...
   * goals: [
   *    {
   *        template: "5f5f5f5f5f5f5f5f5f5f5f5f",
   *        perDay: 4
   *    }
   * ]
   * ...
   */
  goals: {
    type: Array,
    required: true,
  },
});

export default mongoose.models?.LifestyleSummary ||
  mongoose.model("LifestyleSummary", LifestyleSummaryModel);
