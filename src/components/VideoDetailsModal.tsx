/**
 * mobile/src/components/VideoDetailsModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";

export default function VideoDetailsModal(props: {
  modal: React.RefObject<HTMLIonModalElement>;
  video: {
    title: string;
    description: string;
    categories: string[];
  } | null;
}) {
  const [categories, setCategories] = React.useState<
    {
      _id: string;
      name: string;
      description: string;
      image: string;
    }[]
  >([]);

  useEffect(() => {
    REST.Content.categories().then((res) => {
      if (res.status === 200) {
        setCategories(res.payload as any);
      }
    });
  }, []);

  return (
    <>
      <IonModal
        ref={props.modal}
        initialBreakpoint={0.4}
        breakpoints={[0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{props.video?.title}</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton
                color={"success"}
                onClick={() => {
                  props.modal.current?.dismiss();
                }}
              >
                <b>Fertig</b>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className={"ion-padding"}>
            <IonText>{props.video?.description}</IonText>
            {props.video?.categories.map((category) => {
              return (
                <>
                  <IonCard>
                    <img
                      src={categories.find((c) => c._id === category)?.image}
                    />
                    <IonCardHeader>
                      <IonCardTitle>
                        {categories.find((c) => c._id === category)!.name}
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {categories.find((c) => c._id === category)!.description}
                    </IonCardContent>
                  </IonCard>
                </>
              );
            })}
          </div>
        </IonContent>
      </IonModal>
    </>
  );
}
