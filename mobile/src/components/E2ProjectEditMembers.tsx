/**
 * mobile/src/components/E2ProjectEditMembers.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.10.2023
 *
 */

import * as React from "react";
import { E2Project } from "../util/types/E2Project";

export default function E2ProjectEditMembers(props: {
  project: E2Project;
  setProject: (p: E2Project) => void;
}) {
  return (
    <>
      <h1>Members</h1>
    </>
  );
}
