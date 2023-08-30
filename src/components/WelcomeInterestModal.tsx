/**
 * mobile/src/components/WelcomeInterestModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.08.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useRef, useState } from "react";
import { checkmark, checkmarkSharp } from "ionicons/icons";

export default function WelcomeInterestModal(props: {
  modal: React.MutableRefObject<HTMLIonModalElement>;
  presentingElement: HTMLElement | undefined;
}) {
  return (
    <>
      <IonModal ref={props.modal} presentingElement={props.presentingElement}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Interessen</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton
                onClick={() => {
                  props.modal.current?.dismiss();
                }}
              >
                Fertig
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      </IonModal>
    </>
  );
}
