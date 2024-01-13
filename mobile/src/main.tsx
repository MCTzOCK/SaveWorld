import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setApiUrl } from "@saveworld/api-js";
import { ENDPOINT, FLAGSMITH_ENDPOINT, FLAGSMITH_ENVIRONMENT_ID } from "./env";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";
import { Network } from "@capacitor/network";
import Root from "./Root";
import { theme } from "./theme/chakra";
import { ChakraProvider, Flex, Heading, Text } from "@chakra-ui/react";
import Page from "./components/Page";
import MobileBox from "./components/MobileBox";

const render = async () => {
  const status = await Network.getStatus();
  const container = document.getElementById("root");
  const root = createRoot(container!);

  if (status.connected) {
    setApiUrl(ENDPOINT);
    root.render(
      <Root>
        <App />
      </Root>,
    );
  } else {
    root.render(
      <ChakraProvider theme={theme}>
        <Flex
          w={"100%"}
          h={"100vh"}
          alignItems={"center"}
          justifyContent={"center"}
          padding={6}
          direction={"column"}
        >
          <Heading>Kein Internet</Heading>
          <Text>
            Um SaveWorld zu verwenden, benötigst du eine Internetverbindung.
            Bitte stelle sicher, dass du mit dem Internet verbunden bist und
            starte die App gegebenenfalls neu.
          </Text>
        </Flex>
      </ChakraProvider>,
    );
  }
};

render();

Network.addListener("networkStatusChange", render);
