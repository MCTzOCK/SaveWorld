/**
 * backend/src/models/EcoProjectModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.10.2023
 *
 */

import mongoose from "mongoose";

const EcoProjectModel = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  lastsDays: {
    type: Number,
    required: true,
  },
  users: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      // ADMINISTRATOR | EDITOR | MEMBER
      permissions: {
        type: String,
        required: true,
      },
    },
  ],
  geoLocation: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.EcoProject ||
  mongoose.model("EcoProject", EcoProjectModel);
