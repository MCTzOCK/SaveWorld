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
import { useEffect, useState } from "react";
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
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { REST } from "@saveworld/api-js";

export default function WelcomeInterestModal(props: {
  modal: React.MutableRefObject<HTMLIonModalElement>;
  presentingElement: HTMLElement | undefined;
}) {
  const [categories, setCategories] = useState<
    {
      _id: string;
      name: string;
      description: string;
      image: string;
    }[]
  >([]);

  const [selected, setSelected] = useState<string[]>([]);

  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    REST.Content.categories().then((res) => {
      if (res.status === 200) {
        setCategories(res.payload as any);
      }
    });
  };

  const router = useIonRouter();

  return (
    <>
      <IonModal ref={props.modal} presentingElement={props.presentingElement}>
        <IonHeader collapse={"fade"}>
          <IonToolbar>
            <IonTitle>Interessen</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton
                onClick={async () => {
                  const res = await REST.Account.updatePreferences(
                    localStorage.getItem("token") as string,
                    {
                      interests: selected,
                    },
                  );

                  if (res.status !== 200) {
                    alert(
                      "Fehler beim Speichern der Interessen: " +
                        res.payload.error,
                    );
                  }

                  props.modal.current?.dismiss();

                  router.push("/welcome/finish", "forward", "replace");
                }}
              >
                <b>Fertig</b>
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              placeholder={"Suchen"}
              value={query}
              onIonInput={(e) => {
                setQuery(e.detail.value as string);
              }}
            />
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {categories.filter((c) => {
            if (query.length < 1) return true;
            return (
              c.name.toLowerCase().includes(query.toLowerCase()) ||
              c.description.toLowerCase().includes(query.toLowerCase())
            );
          }).length === 0 && (
            <IonText
              style={{
                display: "flex",
                width: "100%",
                height: "50vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Keine Kategorien gefunden!
            </IonText>
          )}
          {categories
            .filter((c) => {
              if (query.length < 1) return true;
              return (
                c.name.toLowerCase().includes(query.toLowerCase()) ||
                c.description.toLowerCase().includes(query.toLowerCase())
              );
            })
            .map((category) => (
              <IonCard>
                <img src={category.image} />
                <IonCardHeader>
                  <IonCardTitle>{category.name}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  {category.description}
                  <IonButton
                    expand={"block"}
                    color={
                      selected.includes(category._id) ? "danger" : "primary"
                    }
                    style={{
                      marginTop: "20px",
                    }}
                    onClick={() => {
                      if (selected.includes(category._id)) {
                        setSelected(selected.filter((s) => s !== category._id));
                      } else {
                        setSelected([...selected, category._id]);
                      }
                    }}
                  >
                    {selected.includes(category._id) ? "Abwählen" : "Auswählen"}
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
        </IonContent>
      </IonModal>
    </>
  );
}
