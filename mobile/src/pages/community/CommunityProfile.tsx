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
import { Avatar } from "@chakra-ui/react";
import PopupManager from "../../util/PopupManager";
export default function CommunityProfile() {
  useRedirectForAnon();

  const { userInfo, loggedIn, loaded } = useUserData();
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
  }, [loaded, userInfo, loggedIn]);

  return (
    <>
      <Page title={username} noPadding>
        <div>
          <img
            alt={"Banner"}
            src={
              profile && profile.banner.length > 0
                ? ENDPOINT + profile.banner
                : "/community_blank_banner.jpg"
            }
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
                  src={ENDPOINT + "/media/profile-picture-username/" + username}
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
                          "Aktionen für " +
                          (profile?.displayName || "@" + username)
                        }
                        subHeader={"@" + username}
                        onIonActionSheetDidDismiss={(ev) => {
                          if (ev.detail.data.action === "edit")
                            editModal.current?.present();
                        }}
                        buttons={[
                          {
                            text: "Profil bearbeiten",
                            data: {
                              action: "edit",
                            },
                          },
                          {
                            text: "Abbrechen",
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
                          "Aktionen für " +
                          (profile?.displayName || "@" + username)
                        }
                        subHeader={"@" + username}
                        onIonActionSheetDidDismiss={async (ev) => {
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
                                  title: "Fehler",
                                  description:
                                    "Es ist ein Fehler aufgetreten: " +
                                    res.payload.error,
                                });
                              }
                              break;
                            case "report":
                              router.push(
                                "/support?category=REPORT_USER&report_user=" +
                                  username,
                              );
                              break;
                            default:
                              PopupManager.alert({
                                title: "Fehler",
                                description:
                                  "Diese Aktion wurde noch nicht implementiert",
                              });
                              break;
                          }
                        }}
                        buttons={[
                          {
                            text: "Nachricht senden",
                            data: {
                              action: "message",
                            },
                          },
                          {
                            text: profile?.followers.includes(userInfo.username)
                              ? "Entfolgen"
                              : "Folgen",
                            role: profile?.followers.includes(userInfo.username)
                              ? "destructive"
                              : "normal",
                            data: {
                              action: "follow",
                            },
                          },
                          {
                            text: "Blockieren",
                            role: "destructive",
                            data: {
                              action: "block",
                            },
                          },
                          {
                            text: "Melden",
                            role: "destructive",
                            data: {
                              action: "report",
                            },
                          },
                          {
                            text: "Abbrechen",
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
                    {profile?.location || "Kein Standort angegeben"}
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
                      ? "Mein Level ist geheim"
                      : "Level " + profile?.level}
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
                  <IonText>{profile?.followers.length} Follower</IonText>
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
          <div
            style={{
              padding: "12px",
              paddingTop: "0",
            }}
          >
            <IonText>
              <h1
                style={{
                  textAlign: "center",
                }}
              >
                Beiträge
              </h1>
            </IonText>
            <hr
              style={{
                backgroundColor: "var(--ion-color-success-shade)",
              }}
            />
            <CommunityProfileBlogList username={username} />
          </div>
        </div>
        <CommunityEditProfileModal
          modal={editModal}
          profile={profile}
          reloadProfile={reloadProfile}
        />
      </Page>
    </>
  );
}
