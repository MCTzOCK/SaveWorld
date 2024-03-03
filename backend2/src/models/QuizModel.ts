/**
 * backend2/src/models/QuizModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.02.2024
 *
 */

import mongoose from "mongoose";

const QuizModel = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  answers: {
    type: Array,
    required: true,
  },
  correctAnswer: {
    type: Number,
    required: true,
  },
  featureImage: {
    type: String,
    required: true,
  },
});

export default mongoose.models?.Quiz || mongoose.model("Quiz", QuizModel);
