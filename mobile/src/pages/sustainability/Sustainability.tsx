/**
 * mobile/src/pages/sustainability/Sustainability.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.11.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import MobileBox from "../../components/MobileBox";
import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useIonRouter } from "@ionic/react";

export default function Sustainability() {
  const router = useIonRouter();

  return (
    <>
      <Page title={"Nachhaltigkeit"}>
        <MobileBox>
          <Flex
            justifyContent={"center"}
            direction={"column"}
            w={"100%"}
            alignItems={"center"}
          >
            <Image
              src={"/assets/sustainability/sustainability_triangle.svg"}
              maxW={"50%"}
              rounded={"xl"}
            />
          </Flex>
          Nachhaltigkeit ist ein sehr wichtiges Thema. Es umfasst allerdings
          nicht nur die Umwelt, sondern besteht aus drei Säulen: Ökologie
          (Unwelt), Ökonomie (Wirtschaft) und Soziales (Gesellschaft).
          <br />
          Diese drei Säulen müssen im Gleichgewicht sein, damit wir eine
          nachhaltige Zukunft haben. Oft werden diese drei Säulen auch als ein
          Dreieck dargestellt, welches auf einer Seite liegt. Das bedeutet, dass
          alle drei Säulen gleich wichtig sind. Wenn eine Säule zu kurz kommt,
          wird das Dreieck instabil und kann umkippen. Das bedeutet, dass wir
          eine nachhaltige Zukunft nur dann haben, wenn alle drei Säulen gleich
          wichtig sind.
          <br />
          Auch, wenn sich SaveWorld vor allem auf die Umwelt konzentriert,
          wollen wir auch die anderen beiden Säulen nicht vernachlässigen.
          Deswegen findest du in diesem Bereich auch Informationen zu den Themen
          Wirtschaft und Gesellschaft.
          <Button
            color={"brand.500"}
            w={"100%"}
            mt={4}
            onClick={() => {
              router.push("/sustainability/articles", "none", "push");
            }}
          >
            Artikel Erkunden
          </Button>
        </MobileBox>
      </Page>
    </>
  );
}
