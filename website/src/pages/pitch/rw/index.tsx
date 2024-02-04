/**
 * website/src/pages/pitch/rw/index.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.02.2024
 *
 */

import * as React from "react";
import Presentation from "@/components/presentation/Presentation";
import Intro from "@/components/presentation/slides/Intro";
import About from "@/components/presentation/slides/About";
import Content from "@/components/presentation/slides/Content";

export default function Index() {
  return (
    <>
      <Presentation>
        <Intro />
        <About />
        <Content />
      </Presentation>
    </>
  );
}
