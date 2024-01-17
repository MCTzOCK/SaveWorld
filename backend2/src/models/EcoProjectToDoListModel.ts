/**
 * backend2/src/models/EcoProjectToDoListModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.11.2023
 *
 */
import mongoose from "mongoose";

const EcoProjectToDoListModel = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EcoProject",
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 25,
  },
});

export default mongoose.models?.EcoProjectToDoList ||
  mongoose.model("EcoProjectToDoList", EcoProjectToDoListModel);
