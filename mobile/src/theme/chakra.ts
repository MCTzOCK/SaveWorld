/**
 * mobile/src/theme/chakra.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.09.2023
 *
 */

import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark",
  },
  colors: {
    saveworld_green: {
      "50": "#EAFBF1",
      "100": "#C4F3D7",
      "200": "#9EEBBC",
      "300": "#78E3A2",
      "400": "#52DB88",
      "500": "#2CD36E",
      "600": "#23A958",
      "700": "#1B7E42",
      "800": "#12542C",
      "900": "#092A16",
    },
  },
});
