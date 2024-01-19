/**
 * backend2/src/models/EcoProjectToDoListItemModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.11.2023
 *
 */
import mongoose from "mongoose";

const EcoProjectToDoListItemModel = new mongoose.Schema({
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EcoProjectToDoList",
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 25,
  },
  description: {
    type: String,
    required: false,
  },
  checked: {
    type: Boolean,
    required: true,
    default: false,
  },
  checkedBy: {
    type: String,
    required: false,
  },
  checkedAt: {
    type: Date,
    required: false,
  },
});

export default mongoose.models?.EcoProjectToDoListItem ||
  mongoose.model("EcoProjectToDoListItem", EcoProjectToDoListItemModel);
