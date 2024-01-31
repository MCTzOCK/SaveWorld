/**
 * website/src/pages/about.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import { Flex, Heading, Stack, Text, SimpleGrid } from "@chakra-ui/react";
import Link from "next/link";
import { INFO } from "@/local-depl-info";

export default function About() {
  return (
    <>
      <Flex align="center" justify="center" w={"100%"} minH={[0, "100vh"]}>
        <Stack
          spacing={8}
          w="100%"
          maxW="1000px"
          p={8}
          bgColor={["transparent", "gray.900"]}
          rounded="lg"
          shadow={["none", "xl"]}
        >
          <Heading color={"primary.500"} size={"2xl"}>
            Über SaveWorld
          </Heading>
          <SimpleGrid columns={2} spacing={10}>
            <Heading size={"md"} fontFamily={"monospace"} color={"gray.200"}>
              Commits: {INFO.git.commits}
            </Heading>
            <Heading size={"md"} fontFamily={"monospace"} color={"gray.200"}>
              Branch: {INFO.git.branch}
            </Heading>
            <Heading size={"md"} fontFamily={"monospace"} color={"gray.200"}>
              Version: {INFO.git.commit}
            </Heading>
            <Heading size={"md"} fontFamily={"monospace"} color={"gray.200"}>
              Letzte Änderung: {INFO.git.lastCommitMessage}
            </Heading>
            <Heading size={"md"} fontFamily={"monospace"} color={"gray.200"}>
              Zeilen: {INFO.sloc}
            </Heading>
          </SimpleGrid>
          <Text fontSize={"xl"}>
            SaveWorld ist eine App, die dir dabei hilft, deinen Alltag
            nachhaltiger zu gestalten. Dabei unterstützt sie dich in
            verschiedenen Bereichen. Der Grundbaustein ist das Lernmaterial,
            welches dir hilft, dich über Nachhaltigkeit zu informieren. Dieses
            kannst du entweder als Kurz-Video (TikTok-Format) oder als
            spannenden Artikel konsumieren.
          </Text>
          <Text fontSize={"xl"}>
            Zusätzlich bietet dir SaveWorld die Möglichkeit, deinen Weg zu einem
            nachhaltigeren Leben mit anderen zu teilen und diese so zu
            inspirieren und zu motivieren. Doch der Austausch ist auch dazu da,
            damit du Fragen stellen kannst, die dir auf deiner Reise begegnen.
            Dies ist durch eine private Chat-Funktion möglich, die es dir
            ebenfalls ermöglicht, in Gruppen zu chatten.
          </Text>
          <Text fontSize={"xl"}>
            Außerdem wichtig war uns, dass du direkt in der App deinen Lifestyle
            tracken kannst, um deine Fortschritte zu sehen und dich selbst zu
            motivieren. Hierfür kannst du Daten zu deinem Verhalten angeben und
            die App schlägt dir anschließend personalisierte Ziele vor. Diese
            Ziele sind immer innerhalb einer Woche zu erreichen. Je mehr Ziele
            du erreichst, desto höher steigt dein Level. So kannst du dich mit
            anderen vergleichen um dich selbst und andere zu motivieren.
          </Text>
          <Text fontSize={"xl"}>
            Wenn du selbst in Aktion treten möchtest, bietet dir die App die
            Möglichkeit, eigene Öko-Projekte zu starten. Diesen können andere
            Benutzer beitreten und dich so unterstützen. Außerdem kannst du
            Projekte in deiner Nähe finden und dich diesen anschließen. Projekte
            können mit fortschrittlichsten Planungswerkzeugen bis ins kleinste
            Detail organisiert werden.
          </Text>
          <Text fontSize={"xl"}>
            <Link
              href={"/technical"}
              passHref
              style={{
                color: "var(--chakra-colors-primary-500)",
              }}
            >
              Wenn dich die technische Umsetzung der App interessiert, kann dir
              dieses Diagramm weiterhelfen!
            </Link>
          </Text>
        </Stack>
      </Flex>
    </>
  );
}
