/**
 * mobile/src/pages/community/CommunityProfile.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Page from "../../components/Page";
import { REST } from "@saveworld/api-js";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useUserData } from "../../hooks/useUserData";
import {
  IonActionSheet,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonInput,
  IonText,
  useIonRouter,
} from "@ionic/react";
import {
  heart,
  map,
  mapSharp,
  menu,
  menuSharp,
  people,
  peopleSharp,
  trophy,
  trophySharp,
} from "ionicons/icons";
import CommunityEditProfileModal from "../../components/CommunityEditProfileModal";
import { ENDPOINT } from "../../env";
import CommunityProfileBlogList from "../../components/CommunityProfileBlogList";
import { Avatar, Box, Image } from "@chakra-ui/react";
import PopupManager from "../../util/PopupManager";
import { Socket } from "socket.io-client";
import socketAuth from "../../util/socketAuth";
import MobileBox from "../../components/MobileBox";
import { $$ } from "../../translations/i18n";
export default function CommunityProfile(props: { socket: Socket }) {
  useRedirectForAnon();

  const { userInfo, loggedIn, loaded } = useUserData();

  const [preferences, setPreferences] = useState<{
    user: string;
    interests: string[];
    picture: string;
    commuity_profile: any;
    blocked_users: string[];
  } | null>(null);
  const { username } = useParams<{ username: string }>();
  const editModal = React.useRef<HTMLIonModalElement>(null);
  const router = useIonRouter();
  const [profile, setProfile] = useState<
    | {
        picture: string;
        displayName: string;
        biography: string;
        banner: string;
        showLevel: boolean;
        location: string;
        level?: number;
        followers: string[];
      }
    | undefined
  >(undefined);

  const [editable, setEditable] = useState<boolean>(false);

  useEffect(() => {
    socketAuth(props.socket, () => {
      props.socket.on("sw:chats.create", (data: any) => {
        if (data.error) {
          PopupManager.alert({
            title: $$("control.error"),
            description: $$(
              "pages.community.profile.chat.loading.erorr",
              data.error,
            ),
          });
          return;
        }

        router.push("/community/messages/" + data.chatId);
      });
    });
  }, []);

  const reloadProfile = () => {
    if (!username) return;

    REST.Community.profile(
      localStorage.getItem("token") as string,
      username,
    ).then((res) => {
      if (res.status === 200) {
        setProfile({
          ...res.payload.profile,
          level: res.payload.level,
        });
      } else {
        PopupManager.alert({
          title: $$("control.error"),
          description: $$(
            "pages.community.profile.chat.loading.erorr",
            res.payload.error,
          ),
          callback: () => {
            router.push("/community", "forward", "push");
          },
        });
      }
    });
  };

  useEffect(() => {
    reloadProfile();
  }, [username]);

  useEffect(() => {
    if (userInfo.username === username) {
      setEditable(true);
    }

    REST.Account.preferences(localStorage.getItem("token") as string).then(
      (res) => {
        if (res.status === 200) {
          setPreferences(res.payload.prefs);
        }
      },
    );
  }, [loaded, userInfo, loggedIn]);

  return (
    <>
      <Page title={username} noPadding>
        <MobileBox>
          <div>
            <Image
              alt={$$("pages.community.profile.banner")}
              src={
                profile && profile.banner.length > 0
                  ? ENDPOINT + profile.banner
                  : "/community_blank_banner.jpg"
              }
              rounded={"md"}
              style={{
                aspectRatio: "16/9",
                width: "100%",
                objectFit: "cover",
              }}
            />
            <IonCard
              style={{
                marginTop: "-20%",
                "--background": "rgba(20,20,20,0.85)",
                boxShadow: "0 0 10px rgba(0,155,0,0.5)",
              }}
            >
              <IonCardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Avatar
                    src={
                      ENDPOINT + "/media/profile-picture-username/" + username
                    }
                  />
                  <IonText color={"dark"}>
                    <h1>{profile?.displayName || username}</h1>
                    <h2>@{username}</h2>
                  </IonText>
                  <div>
                    <IonButton color={"success"} id={"open-profile-menu"}>
                      <IonIcon ios={menu} md={menuSharp} />
                    </IonButton>
                    {editable ? (
                      <>
                        <IonActionSheet
                          trigger={"open-profile-menu"}
                          header={
                            $$("pages.community.profile.actions.for") +
                            " " +
                            (profile?.displayName || "@" + username)
                          }
                          subHeader={"@" + username}
                          onIonActionSheetDidDismiss={(ev) => {
                            if (ev.detail.data.action === "edit")
                              editModal.current?.present();
                          }}
                          buttons={[
                            {
                              text: $$("pages.community.profile.actions.edit"),
                              data: {
                                action: "edit",
                              },
                            },
                            {
                              text: $$("control.cancel"),
                              role: "cancel",
                              data: {
                                action: "cancel",
                              },
                            },
                          ]}
                        />
                      </>
                    ) : (
                      <>
                        <IonActionSheet
                          trigger={"open-profile-menu"}
                          header={
                            $$("pages.community.profile.actions.for") +
                            " " +
                            (profile?.displayName || "@" + username)
                          }
                          subHeader={"@" + username}
                          onIonActionSheetDidDismiss={async (ev) => {
                            if (ev.detail.data.action === "cancel") return;

                            switch (ev.detail.data.action) {
                              case "follow":
                                const res = await REST.Community.follow(
                                  localStorage.getItem("token") as string,
                                  username,
                                );

                                if (res.status === 200) {
                                  reloadProfile();
                                } else {
                                  PopupManager.alert({
                                    title: $$("control.error"),
                                    description: $$(
                                      "pages.community.profile.actions.follow.error",
                                      res.payload.error,
                                    ),
                                  });
                                }
                                break;
                              case "report":
                                router.push(
                                  "/support?category=REPORT_USER&report_user=" +
                                    username,
                                );
                                break;
                              case "message":
                                props.socket.emit("sw:chats.create", username);
                                break;
                              case "block":
                                if (!preferences) return;
                                let newBlockedUsers: string[] = [
                                  ...preferences.blocked_users,
                                ];
                                if (newBlockedUsers.includes(username)) {
                                  newBlockedUsers = newBlockedUsers.filter(
                                    (u) => u !== username,
                                  );
                                } else {
                                  newBlockedUsers.push(username);
                                }

                                const resX =
                                  await REST.Account.updatePreferences(
                                    localStorage.getItem("token") as string,
                                    {
                                      blocked_users: newBlockedUsers,
                                    },
                                  );

                                if (resX.status === 200) {
                                  setPreferences({
                                    ...preferences,
                                    blocked_users: newBlockedUsers,
                                  });
                                } else {
                                  PopupManager.alert({
                                    title: $$("control.error"),
                                    description: $$(
                                      "pages.community.profile.actions.block.error",
                                      resX.payload.error,
                                    ),
                                  });
                                }

                                break;
                              default:
                                PopupManager.alert({
                                  title: $$("control.error"),
                                  description: $$(
                                    "pages.community.profile.actions.not.implemented",
                                  ),
                                });
                                break;
                            }
                          }}
                          buttons={[
                            {
                              text: $$(
                                "pages.community.profile.actions.message",
                              ),
                              data: {
                                action: "message",
                              },
                            },
                            {
                              text: profile?.followers.includes(
                                userInfo.username,
                              )
                                ? $$("pages.community.profile.unfollow")
                                : $$("pages.community.profile.follow"),
                              role: profile?.followers.includes(
                                userInfo.username,
                              )
                                ? "destructive"
                                : "normal",
                              data: {
                                action: "follow",
                              },
                            },
                            {
                              text: preferences?.blocked_users.includes(
                                username,
                              )
                                ? $$("pages.community.profile.unblock")
                                : $$("pages.community.profile.block"),
                              role: "destructive",
                              data: {
                                action: "block",
                              },
                            },
                            {
                              text: $$("pages.community.profile.report"),
                              role: "destructive",
                              data: {
                                action: "report",
                              },
                            },
                            {
                              text: $$("control.cancel"),
                              role: "cancel",
                              data: {
                                action: "cancel",
                              },
                            },
                          ]}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    paddingTop: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: ".75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "1.2rem",
                    }}
                  >
                    <IonIcon ios={map} md={mapSharp} />
                    <IonText>
                      {profile?.location ||
                        $$("pages.community.profile.no.location")}
                    </IonText>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "1.2rem",
                    }}
                  >
                    <IonIcon ios={trophy} md={trophySharp} />
                    <IonText>
                      {/* TODO */}
                      {!profile?.showLevel
                        ? $$("pages.community.profile.no.level")
                        : $$("general.level") + " " + profile?.level}
                    </IonText>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "1.2rem",
                    }}
                  >
                    <IonIcon ios={people} md={peopleSharp} />
                    <IonText>
                      {profile?.followers.length}{" "}
                      {$$("pages.community.profile.followers")}
                    </IonText>
                  </div>
                </div>
                <div
                  style={{
                    paddingTop: "12px",
                  }}
                >
                  <IonText>
                    <h3>{profile?.biography}</h3>
                  </IonText>
                </div>
              </IonCardContent>
            </IonCard>
            <Box mt={["1rem", "3rem"]}>
              <IonText>
                <h1
                  style={{
                    textAlign: "center",
                  }}
                >
                  {$$("pages.community.profile.blogs")}
                </h1>
              </IonText>
              <hr
                style={{
                  backgroundColor: "var(--ion-color-success-shade)",
                }}
              />
              <CommunityProfileBlogList username={username} />
            </Box>
          </div>
        </MobileBox>
        <CommunityEditProfileModal
          modal={editModal}
          profile={profile}
          reloadProfile={reloadProfile}
        />
      </Page>
    </>
  );
}
