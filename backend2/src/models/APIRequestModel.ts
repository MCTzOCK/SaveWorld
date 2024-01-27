/**
 * backend2/src/models/APIRequestModel.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.01.2024
 *
 */

import mongoose from "mongoose";

const APIRequestModel = new mongoose.Schema({
  reqId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  method: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  params: {
    type: Object,
    required: false,
  },
  headers: {
    type: Object,
    required: false,
  },
  body: {
    type: Object,
    required: false,
  },
  query: {
    type: Object,
    required: false,
  },
  responseStatus: {
    type: Number,
    required: false,
  },
  responseHeaders: {
    type: Object,
    required: false,
  },
  responseBody: {
    type: Object,
    required: false,
  },
});

export default mongoose.models?.APIRequest ||
  mongoose.model("APIRequest", APIRequestModel);
