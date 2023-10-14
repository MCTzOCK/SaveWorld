/**
 * mobile/src/components/HighlightedText.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import * as React from "react";

export default function HighlightedText(props: { children: React.ReactNode }) {
  return (
    <b
      style={{
        color: "var(--ion-color-success)",
      }}
    >
      {props.children}
    </b>
  );
}
