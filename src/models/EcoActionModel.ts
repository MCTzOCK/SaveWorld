/**
 * backend/src/models/EcoActionModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.09.2023
 *
 */

import mongoose from "mongoose";

const EcoActionModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    // YYYY-MM-DD
    type: String,
    required: true,
  },
});

export default mongoose.models?.EcoAction ||
  mongoose.model("EcoAction", EcoActionModel);
