/**
 * website/src/components/Logo.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";

export default function Logo(props: { s: number }) {
  return (
    <>
      <img
        src={
          "https://content.saveworld.one/assets/7de3ae7c-0d86-416a-a761-93403ae870ca"
        }
        alt={"Logo"}
        width={props.s}
        height={props.s}
      />
    </>
  );
}
