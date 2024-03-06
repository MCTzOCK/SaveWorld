/**
 * mobile/src/pages/Notifications.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import * as React from "react";
import Page from "../components/Page";
import PopupManager from "../util/PopupManager";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js/index";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { Grid } from "@chakra-ui/react";
import { $$ } from "../translations/i18n";

export default function Notifications() {
  const [page, setPage] = React.useState(0);

  const [notifications, setNotifications] = React.useState<
    {
      _id: string;
      user: string;
      title: string;
      content: string;
      read: boolean;
      createdAt: string;
      launch_url: string;
      __v: number;
    }[]
  >([]);

  const [pages, setPages] = React.useState(0);

  const loadPage = async (p: number) => {
    const res = await REST.Notifications.notifications(
      localStorage.getItem("token") as string,
      p,
    );

    if (res.status === 200) {
      setNotifications(res.payload.entries);
      setPages(res.payload.pages);
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$("page.notifications.error.loading", res.payload.error),
      });
    }
  };

  const router = useIonRouter();

  useEffect(() => {
    loadPage(page);
  }, [page]);
  return (
    <>
      <Page title={$$("menu.notifications")}>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
        >
          {notifications.map((n) => {
            return (
              <>
                <IonCard
                  onClick={async () => {
                    await REST.Notifications.read(
                      localStorage.getItem("token") as string,
                      n._id,
                    );

                    if (n.launch_url) {
                      router.push(
                        n.launch_url.split(".one")[1],
                        "none",
                        "push",
                      );
                    } else {
                      loadPage(page);
                    }
                  }}
                >
                  <IonCardHeader>
                    <IonCardSubtitle>
                      {n.read ? (
                        <>
                          <IonText color={"success"}>
                            {$$("page.notifications.read")}
                          </IonText>
                        </>
                      ) : (
                        <>
                          <IonText color={"danger"}>
                            {$$("page.notifications.unread")}
                          </IonText>
                        </>
                      )}
                      &nbsp;-&nbsp;
                      {new Date(n.createdAt).toLocaleString()}
                    </IonCardSubtitle>
                    <IonCardTitle>{n.title}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>{n.content}</IonCardContent>
                </IonCard>
              </>
            );
          })}
        </Grid>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {page > 0 ? (
            <IonButton
              color={"danger"}
              onClick={() => setPage(page - 1)}
              expand={"block"}
            >
              {$$("control.back")}
            </IonButton>
          ) : null}
          {page < pages - 1 ? (
            <IonButton
              color={"success"}
              onClick={() => setPage(page + 1)}
              expand={"block"}
            >
              {$$("control.next")}
            </IonButton>
          ) : null}
        </div>
      </Page>
    </>
  );
}
