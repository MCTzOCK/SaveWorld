/**
 * mobile/src/pages/e2-projects/project/E2ProjectHomepage.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../../hooks/useRedirectForAnon";
import { E2Project } from "../../../util/types/E2Project";
import Page from "../../../components/Page";

export default function E2ProjectHomepage() {
  useRedirectForAnon();

  const [project, setProject] = React.useState<E2Project | null>(null);

  if (!project) {
    return (
      <>
        <Page title={"Laden..."}>Laden...</Page>
      </>
    );
  }

  return (
    <>
      <Page title={project.name}>project.name</Page>
    </>
  );
}
