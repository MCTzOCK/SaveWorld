/**
 * backend/src/models/LifestyleTemplate.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.09.2023
 *
 */

import mongoose from "mongoose";

const LifeStyleTemplateModel = new mongoose.Schema({
  name: {
    // Ich fahre mit dem Auto zur Arbeit.
    type: String,
    required: true,
  },
  goal: {
    // Ich bin nicht mit dem Auto zur Arbeit gefahren.
    type: String,
    required: true,
  },
});

export default mongoose.models?.LifeStyleTemplateModel ||
  mongoose.model("LifeStyleTemplate", LifeStyleTemplateModel);
