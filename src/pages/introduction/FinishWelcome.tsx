/**
 * mobile/src/pages/FinishWelcome.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.08.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import { Box, Flex } from "@chakra-ui/react";

export default function FinishWelcome() {
  return (
    <>
      <Page title={"Fertig!"}>
        <Flex
          w={"100%"}
          justifyContent={["flex-start", "center"]}
          alignItems={["flex-start", "center"]}
          minH={"100vh"}
        >
          <Box
            backgroundColor={"rgba(10,10,10,0.5)"}
            borderRadius={"12px"}
            border={"4px solid rgba(40,40,40,1)"}
            w={["100%", "75%", "50%", "25%"]}
            minW={"200px"}
            padding={"1rem"}
          >
            <IonText>
              Du hast die Einrichtung erfolgreich abgeschlossen! Du kannst jetzt
              anfagen die Welt zu einem besseren Ort zu machen!
            </IonText>
            <IonButton
              expand={"block"}
              color={"success"}
              style={{
                marginTop: "2rem",
              }}
              routerLink={"/"}
              routerDirection={"none"}
            >
              Die Welt verbessern!
            </IonButton>
          </Box>
        </Flex>
      </Page>
    </>
  );
}
