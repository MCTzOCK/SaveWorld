/**
 * website/src/pages/contact.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import { Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";

export default function Contact() {
  return (
    <>
      <Flex align="center" justify="center" w={"100%"} minH={[0, "100vh"]}>
        <Stack
          spacing={8}
          w="100%"
          maxW="800px"
          p={8}
          bgColor={["transparent", "#000"]}
          rounded="lg"
          shadow={["none", "xl"]}
        >
          <Heading size={"2xl"} color={"primary.500"}>
            Kontakt
          </Heading>
          <Text fontSize={"lg"}>
            Bei Fragen, Anregungen oder Problemen können Sie sich gerne an uns
            wenden.
          </Text>
          <Text fontSize={"lg"}>
            Sie können uns entweder per E-Mail oder durch das Kontaktformular in
            der (Web-)App (Anmeldung erforderlich) erreichen.
          </Text>
          <Text fontSize={"lg"}>
            E-Mail:&nbsp;
            <Link href={"mailto:ben@saveworld.one"} color={"primary.500"}>
              ben@saveworld.one
            </Link>
            <br />
            Kontaktformular:&nbsp;
            <Link
              href={"https://app.saveworld.one/contact"}
              color={"primary.500"}
            >
              https://app.saveworld.one/contact
            </Link>
            <br />
            Kontaktformular (ohne Anmeldung):&nbsp;
            <Link
              href={"https://ben-siebert.com/contact"}
              color={"primary.500"}
            >
              https://ben-siebert.com/contact
            </Link>
          </Text>
          <Text fontSize={"lg"}>
            Wir nehmen keine Anrufe entgegen und bearbeiten auch keine
            postalischen Anfragen. Wir bitten Sie dies zu berücksichtigen.
            Ebenfalls bitten wir Sie, keine Anfragen an die oben genannte
            E-Mail-Adresse zu senden, die nicht das Projekt SaveWorld betreffen.
            Bitte beachten Sie, dass wir Ihre Anfrage nicht schneller bearbeiten
            können, wenn Sie uns mehrfach kontaktieren. Wir bearbeiten jede
            Anfrage so schnell wie möglich.
          </Text>
        </Stack>
      </Flex>
    </>
  );
}
