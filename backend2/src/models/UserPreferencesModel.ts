/**
 * backend2/src/models/UserPreferencesModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.08.2023
 *
 */

import mongoose from "mongoose";

const UserPreferencesModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  interests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  picture: {
    type: String,
    required: false,
  },
  /** PUBLICLY AVAILABLE **/
  community_profile: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  /** PUBLICLY AVAILABLE **/
  blocked_users: {
    type: [String],
    required: false,
    default: [],
  },
  cookbookItems: {
    type: [mongoose.Schema.ObjectId],
    ref: "Recipe",
    required: false,
    default: [],
  },
  ai_left_usage: {
    type: Number,
    required: false,
    default: 0,
  },
  ai_resets_usage: {
    type: Number,
    required: false,
    default: 0,
  },
});

export default mongoose.models?.UserPreferences ||
  mongoose.model("UserPreferences", UserPreferencesModel);
