/**
 * backend/src/util/nominatimHelpers.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.10.2023
 *
 */

import { NominatimResults } from "../types/NominatimResult";

/**
 * Queries the Nominatim API for a given search query and processes the result.
 * @param q Search Query
 */
export async function searchNominatim(q: string): Promise<NominatimResults> {
  const fRes = await fetch(
    `${process.env.NOMINATIM_URL}?q=${q}&format=jsonv2&addressdetails=1&limit=1`,
  );
  const res = await fRes.json();
  return res;
}
