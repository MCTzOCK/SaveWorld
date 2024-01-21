/**
 * mobile/src/components/ManageAccountInterests.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.11.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../hooks/useRedirectForAnon";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import Page from "./Page";
import MobileBox from "./MobileBox";
import { IonItem, IonList, IonText, IonToggle } from "@ionic/react";
import { $$ } from "../translations/i18n";
import { translateOnlineV3 } from "../util/online-translate";

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
    REST.Content.categories().then(async (res) => {
      const categories = res.payload as any;

      if (window.language !== "de") {
        for (const c of categories) {
          c.name = await translateOnlineV3({
            text: c.name,
            to: window.language,
          });
        }
      }

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
      <IonText>{$$("components.manage.interests.intro")}</IonText>
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
        {categories.filter((c) => !preferences.interests.includes(c._id))
          .length === 0
          ? $$("components.manage.interests.all.selected")
          : $$("components.manage.interests.more.selectable")}
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
    </>
  );
}
