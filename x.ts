/**
 * /x.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.08.2023
 *
 */

import { authenticator } from "otplib";

console.log(authenticator.generate("HEAWG6TAHUMAETBA"));
