/**
 * mobile/src/pages/admin/AdminContentCategoryDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.08.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSearchbar,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { add, addSharp } from "ionicons/icons";
import AdminCreateCategoryModal from "../../components/AdminCreateCategoryModal";
import PopupManager from "../../util/PopupManager";
import { Grid } from "@chakra-ui/react";
import MobileBox from "../../components/MobileBox";
import { $$ } from "../../translations/i18n";

export default function AdminContentCategoryDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const modal = React.useRef<HTMLIonModalElement>(null);

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
      if (res.status === 200) {
        setCategories(res.payload as any);
      } else {
        PopupManager.alert({
          title: $$("control.error"),
          description: $$(
            "pages.admin.category.loading.error",
            res.payload.error,
          ),
        });
      }
      setLoading(false);
    });
  };

  return (
    <>
      <Page title={$$("pages.admin.category.title")} redGradient>
        {loading && (
          <>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "50vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonSpinner />
            </div>
          </>
        )}
        {!loading && (
          <>
            <MobileBox bg={"#101010"}>
              <IonSearchbar
                value={query}
                onIonInput={(e) => {
                  setQuery(e.detail.value || "");
                }}
              />
              {categories.filter((c) => {
                if (query.length === 0) return true;
                return (
                  c.name.toLowerCase().includes(query.toLowerCase()) ||
                  c.description.toLowerCase().includes(query.toLowerCase())
                );
              }).length === 0 ? (
                <>
                  <IonText className={"ion-padding"}>
                    {$$("pages.admin.category.no.categories")}
                  </IonText>
                </>
              ) : (
                <>
                  <Grid
                    templateColumns={[
                      "repeat(1, 1fr)",
                      "repeat(2, 1fr)",
                      "repeat(3, 1fr)",
                    ]}
                  >
                    {categories
                      .filter((c) => {
                        if (query.length === 0) return true;
                        return (
                          c.name.toLowerCase().includes(query.toLowerCase()) ||
                          c.description
                            .toLowerCase()
                            .includes(query.toLowerCase())
                        );
                      })
                      .map((c) => {
                        return (
                          <>
                            <IonCard>
                              <img src={c.image} />
                              <IonCardHeader>
                                <IonCardTitle>{c.name}</IonCardTitle>
                              </IonCardHeader>
                              <IonCardContent>
                                {c.description}
                                <IonButton
                                  expand={"block"}
                                  color={"danger"}
                                  style={{ marginTop: "20px" }}
                                  onClick={async () => {
                                    if (
                                      !(await PopupManager.confirmAsync({
                                        title: $$("control.delete"),
                                        question: $$(
                                          "pages.admin.category.delete",
                                        ),
                                      }))
                                    )
                                      return;

                                    const res = await REST.Admin.deleteCategory(
                                      localStorage.getItem("token") as string,
                                      c._id,
                                    );

                                    if (res.status === 200) {
                                      reload();
                                    } else {
                                      PopupManager.alert({
                                        title: $$("control.error"),
                                        description: $$(
                                          "pages.admin.category.delete.error",
                                          res.payload.error,
                                        ),
                                      });
                                    }
                                  }}
                                >
                                  {$$("control.delete")}
                                </IonButton>
                              </IonCardContent>
                            </IonCard>
                          </>
                        );
                      })}
                  </Grid>
                </>
              )}
            </MobileBox>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton
                onClick={() => {
                  modal.current?.present();
                }}
                color={"danger"}
              >
                <IonIcon ios={add} md={addSharp} />
              </IonFabButton>
            </IonFab>
            <AdminCreateCategoryModal
              modal={modal}
              callback={(name, description, image) => {
                reload();
              }}
            />
          </>
        )}
      </Page>
    </>
  );
}
