/**
 * mobile/src/pages/account/ManageAccountInterests.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.08.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import {
  IonCheckbox,
  IonItem,
  IonList,
  IonText,
  IonToggle,
} from "@ionic/react";

export default function ManageAccountInterests() {
  useRedirectForAnon();

  const [preferences, setPreferences] = useState<{
    interests: string[];
  }>({
    interests: [],
  });

  const [categories, setCategories] = useState<
    {
      _id: string;
      name: string;
      description: string;
      image: string;
    }[]
  >([]);

  useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    REST.Content.categories().then((res) => {
      setCategories(res.payload as any);
      REST.Account.preferences(localStorage.getItem("token") as string).then(
        (res2) => {
          setPreferences(res2.payload.prefs);
        },
      );
    });
  };

  return (
    <>
      <Page title={"Interessen"}>
        <IonText>Aktuell hast du folgenden Interessen angegeben:</IonText>
        <IonList
          style={{
            marginTop: "20px",
          }}
          inset
        >
          {preferences.interests.map((interest) => {
            return (
              <IonItem color={"light"}>
                <IonToggle
                  checked={true}
                  onIonChange={async () => {
                    await REST.Account.updatePreferences(
                      localStorage.getItem("token") as string,
                      {
                        interests: preferences.interests.filter(
                          (i) => i !== interest,
                        ),
                      },
                    );
                    reload();
                  }}
                >
                  <IonText>
                    {categories.find((c) => c._id === interest)!.name}
                  </IonText>
                </IonToggle>
              </IonItem>
            );
          })}
        </IonList>
        <IonText>
          Du kannst zusätzlich noch folgenden Interessen auswählen:
        </IonText>
        <IonList inset>
          {categories
            .filter((c) => !preferences.interests.includes(c._id))
            .map((i) => {
              return (
                <>
                  <IonItem color={"light"}>
                    <IonToggle
                      checked={false}
                      onIonChange={async () => {
                        await REST.Account.updatePreferences(
                          localStorage.getItem("token") as string,
                          {
                            interests: [...preferences.interests, i._id],
                          },
                        );
                        reload();
                      }}
                    >
                      <IonText>{i.name}</IonText>
                    </IonToggle>
                  </IonItem>
                </>
              );
            })}
        </IonList>
      </Page>
    </>
  );
}
