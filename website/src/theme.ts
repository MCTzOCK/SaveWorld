/**
 * website/src/theme.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    black: "#000000",
    primary: {
      "50": "#E9FCF0",
      "100": "#C1F5D6",
      "200": "#99EFBC",
      "300": "#72E9A1",
      "400": "#4AE387",
      "500": "#22DD6C",
      "600": "#1BB157",
      "700": "#148541",
      "800": "#0E582B",
      "900": "#072C16",
    },
    gray: {
      "50": "#F2F2F3",
      "100": "#DADADC",
      "200": "#C2C2C6",
      "300": "#ABABB0",
      "400": "#93939A",
      "500": "#7B7B84",
      "600": "#636369",
      "700": "#4A4A4F",
      "800": "#313135",
      "900": "#19191A",
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("gray.50", "gray.900")(props),
      },
    }),
  },
});
