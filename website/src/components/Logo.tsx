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
      <img src={"/logo.png"} alt={"Logo"} width={props.s} height={props.s} />
    </>
  );
}
