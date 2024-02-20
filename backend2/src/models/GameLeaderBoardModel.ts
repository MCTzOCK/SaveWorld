/**
 * backend2/src/models/GameLeaderBoardModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.02.2024
 *
 */

import mongoose from "mongoose";

const GameLeaderBoardModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  game: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

export default mongoose.models?.GameLeaderBoard ||
  mongoose.model("GameLeaderBoard", GameLeaderBoardModel);
