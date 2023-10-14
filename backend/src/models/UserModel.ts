/**
 * src/models/UserModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2023
 *
 */

import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 30,
    minlength: 3,
    immutable: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
    minlength: 3,
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["user", "admin"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  activationToken: {
    type: String,
    required: false,
  },
  totpSecret: {
    type: String,
    required: false,
  },
});

export default mongoose.models?.User || mongoose.model("User", UserModel);
