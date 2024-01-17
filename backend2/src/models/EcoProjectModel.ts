/**
 * backend2/src/models/EcoProjectModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.10.2023
 *
 */

import mongoose, { Schema } from "mongoose";
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
      username: {
        type: String,
        required: true,
      },
      // ADMINISTRATOR | EDITOR | MEMBER
      permissions: {
        type: String,
        required: true,
      },
    },
  ],
  geoLocationType: {
    type: String,
    required: true,
  },
  geoLocationDisplayName: {
    type: String,
    required: true,
  },
  geoLocationLat: {
    type: String,
    required: false,
  },
  geoLocationLon: {
    type: String,
    required: false,
  },
});

export default mongoose.models?.EcoProject ||
  mongoose.model("EcoProject", EcoProjectModel);
