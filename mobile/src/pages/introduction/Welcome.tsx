/**
 * mobile/src/pages/Welcome.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.08.2023
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
import { useEffect, useRef, useState } from "react";
import WelcomeInterestModal from "../../components/WelcomeInterestModal";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { Box, Flex } from "@chakra-ui/react";
import MobileBox from "../../components/MobileBox";
import { $$ } from "../../translations/i18n";

export default function Welcome() {
  useRedirectForAnon();

  const modal = useRef<HTMLIonModalElement>(
    null,
  ) as React.MutableRefObject<HTMLIonModalElement>;
  const page = useRef(null);
  const [presentingElement, setPresentingElement] = useState<HTMLElement>();

  useEffect(() => {
    if (page.current) {
      setPresentingElement(page.current);
    }
  }, []);

  return (
    <>
      <Page
        title={$$("general.welcome")}
        setPresentingElement={setPresentingElement}
      >
        <MobileBox>
          <IonText>{$$("pages.introduction.welcome.description")}</IonText>
          <IonButton
            expand={"block"}
            color={"success"}
            style={{
              marginTop: "2rem",
            }}
            onClick={() => {
              modal.current?.present();
            }}
          >
            {$$("control.next")}
          </IonButton>
          <IonButton
            expand={"block"}
            color={"danger"}
            fill={"outline"}
            style={{
              marginTop: "1.2rem",
            }}
            routerLink={"/onboarding"}
            routerDirection={"none"}
          >
            {$$("pages.introduction.welcome.choose.later")}
          </IonButton>
        </MobileBox>
        <WelcomeInterestModal
          modal={modal}
          presentingElement={presentingElement}
        />
      </Page>
    </>
  );
}
