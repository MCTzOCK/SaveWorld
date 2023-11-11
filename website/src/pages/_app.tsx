import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import NavigationBar from "@/components/NavigationBar";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme } from "@/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SaveWorld - Gemeinsam die Welt verbessern</title>
        <meta charSet="UTF-8" />
        <meta content={"width=device-width, initial-scale=1"} name="viewport" />
      </Head>
      <ChakraProvider theme={theme}>
        <NavigationBar />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
