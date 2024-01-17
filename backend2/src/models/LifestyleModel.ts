/**
 * backend2/src/models/LifestyleModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.09.2023
 *
 */

import mongoose from "mongoose";

const LifestyleModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  actions: {
    type: Array,
    required: true,
    default: [],
  },
  goals: {
    type: Array,
    required: true,
    default: [],
  },
});

/*
 * Sample:
 * {
 *   user: "5f5f5f5f5f5f5f5f5f5f5f5f",
 *   actions: [
 *     {
 *       template: "5f5f5f5f5f5f5f5f5f5f5f5f",
 *       currentPerWeek: 4
 *     }
 *   ],
 *   goals: [
 *     {
 *       template: "5f5f5f5f5f5f5f5f5f5f5f5f",
 *       goalPerWeek: 2
 *     }
 *   ]
 * }
 */

export default mongoose.models?.LifestyleModel ||
  mongoose.model("Lifestyle", LifestyleModel);
