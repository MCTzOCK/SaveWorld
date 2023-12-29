/**
 * website/src/pages/legal/notice.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import { Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";

export default function Notice() {
  return (
    <>
      <Flex align="center" justify="center" w={"100%"} minH={[0, "100vh"]}>
        <Stack
          spacing={8}
          w="100%"
          maxW="800px"
          p={8}
          bgColor={["transparent", "gray.900"]}
          rounded="lg"
          shadow={["none", "xl"]}
        >
          <Heading
            as="h1"
            size="2xl"
            textAlign={["center", "initial"]}
            color={"primary.500"}
          >
            Impressum
          </Heading>
          <Heading as="h2" size="lg" textAlign={["center", "initial"]}>
            Geltungsbereich
          </Heading>
          <Text fontSize={"lg"}>
            Dieses Impressum gilt für die Inhalte aller Websiten unter der
            Domain saveworld.one. Hierzu zählen jegliche Subdomains. Ausgenommen
            sind Inhalte, die von anderen Betreibern zur Verfügung gestellt
            werden.
          </Text>
          <Heading as="h2" size="lg" textAlign={["center", "initial"]}>
            Angaben gemäß § 5 TMG
          </Heading>
          <Text fontSize={"lg"}>
            Ben Siebert
            <br />
            Im Mühlenwinkel 14
            <br />
            45525 Hattingen
          </Text>
          <Heading as="h2" size="lg" textAlign={["center", "initial"]}>
            Kontakt
          </Heading>
          <Text fontSize={"lg"}>
            E-Mail:&nbsp;
            <Link href="mailto:hello@ben-siebert.de" color={"blue.400"}>
              hello@ben-siebert.de
            </Link>
          </Text>
          <Heading as="h2" size="lg" textAlign={["center", "initial"]}>
            Redaktionell Verantwortlicher
          </Heading>
          <Text fontSize={"lg"}>Ben Siebert</Text>
        </Stack>
      </Flex>
    </>
  );
}
