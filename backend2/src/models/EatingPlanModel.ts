/**
 * backend2/src/models/EatingPlan.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.12.2023
 *
 */

import mongoose from "mongoose";

const EatingPlanModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
  ],
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.EatingPlan ||
  mongoose.model("EatingPlan", EatingPlanModel);
