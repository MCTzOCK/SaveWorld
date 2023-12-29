/**
 * mobile/src/pages/eatingplans/EatingPlanViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useState } from "react";

export default function EatingPlanViewer() {
  const [plan, setPlan] = useState<{
    _id: string;
    user: string;
    recipes: any[];
    date: string;
  } | null>(null);

  return (
    <>
      <Page title={"Essensplan"}>123</Page>
    </>
  );
}
