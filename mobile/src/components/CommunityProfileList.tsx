/**
 * mobile/src/components/CommunityProfileList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.09.2023
 *
 */

import * as React from "react";
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonText,
} from "@ionic/react";
import { chatbox, heart, pricetag } from "ionicons/icons";
import { ENDPOINT } from "../env";
import { Avatar, Grid } from "@chakra-ui/react";

export default function CommunityProfileList(props: {
  profiles: {
    username: string;
    displayName: string;
    biography: string;
    location: string;
  }[];
  page: number;
  pages: number;
  setPage: (page: number) => void;
}) {
  return (
    <>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
      >
        {props.profiles.map((profile) => {
          return (
            <>
              <IonCard routerLink={"/community/u/" + profile.username}>
                <IonCardContent
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "3rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      alignItems: "start",
                      textTransform: "lowercase",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      src={
                        ENDPOINT +
                        "/media/profile-picture-username/" +
                        profile.username
                      }
                    />
                    <IonText>
                      <h1
                        style={{
                          color: "var(--ion-color-dark)",
                        }}
                      >
                        {profile.displayName}
                      </h1>
                      <p>@{profile.username}</p>
                    </IonText>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      alignItems: "start",
                      textTransform: "lowercase",
                      justifyContent: "center",
                    }}
                  >
                    {profile.biography}
                  </div>
                </IonCardContent>
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
        {props.page > 0 ? (
          <IonButton
            color={"danger"}
            onClick={() => props.setPage(props.page - 1)}
            expand={"block"}
          >
            Zurück
          </IonButton>
        ) : null}
        {props.page < props.pages - 1 ? (
          <IonButton
            color={"success"}
            onClick={() => props.setPage(props.page + 1)}
            expand={"block"}
          >
            Weiter
          </IonButton>
        ) : null}
      </div>
    </>
  );
}
