/**
 * mobile/src/pages/community/CommunityBlogViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useParams } from "react-router";
import Page from "../../components/Page";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPopover,
  IonRouterLink,
  IonText,
  IonTextarea,
  useIonRouter,
} from "@ionic/react";
import { ENDPOINT } from "../../env";
import {
  chatbox,
  chatboxSharp,
  flag,
  heart,
  heartOutline,
  heartSharp,
  pricetag,
  send,
  time,
  timeSharp,
  trash,
  watch,
  watchSharp,
} from "ionicons/icons";
import ReactMarkdown from "react-markdown";
import { useUserData } from "../../hooks/useUserData";
import PopupManager from "../../util/PopupManager";
import { Avatar } from "@chakra-ui/react";
export default function CommunityBlogViewer() {
  useRedirectForAnon();

  const { id } = useParams<{ id: string }>();

  const { loggedIn, userInfo } = useUserData();
  const router = useIonRouter();

  const [blog, setBlog] = React.useState<
    | {
        _id: string;
        username: string;
        title: string;
        content: string;
        tags: string[];
        comments: any[];
        likes: any[];
        createdAt: string;
      }
    | undefined
  >(undefined);

  const [profile, setProfile] = useState<
    | {
        picture: string;
        displayName: string;
        biography: string;
        banner: string;
        showLevel: boolean;
        location: string;
        level?: number;
      }
    | undefined
  >(undefined);

  const [mentions, setMentions] = useState<string[]>([]);

  const reload = async () => {
    const res = await REST.Community.blogEntry(
      localStorage.getItem("token") as string,
      id,
    );

    if (res.status === 200) {
      setBlog(res.payload.entry);
      const m_entions = res.payload.entry.content.match(/@([a-zA-Z0-9_]+)/g);

      if (m_entions) {
        setMentions(m_entions.map((m: any) => m.replace("@", "")));
      }
    } else {
      PopupManager.alert({
        title: "Fehler",
        description: "Blog nicht gefunden!",
      });
    }

    const res2 = await REST.Community.profile(
      localStorage.getItem("token") as string,
      res.payload.entry.username,
    );

    if (res2.status === 200) {
      setProfile({
        ...res2.payload.profile,
        level: res2.payload.level,
      });
    } else {
      PopupManager.alert({
        title: "Fehler",
        description: "Profil nicht gefunden!",
      });
    }
  };

  useEffect(() => {
    reload();
  }, [id]);

  return (
    <>
      <Page title={"Blog"}>
        {blog && profile && (
          <>
            <IonCard
              style={{
                padding: "0px",
                background: "transparent",
                boxShadow: "0 0 10px rgba(0,155,0,0.75)",
              }}
            >
              <IonCardHeader>
                <IonCardTitle>
                  {profile?.displayName} (@{blog.username})
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    flexDirection: "row",
                  }}
                >
                  <Avatar
                    src={
                      ENDPOINT +
                      "/media/profile-picture-username/" +
                      blog.username
                    }
                    style={{
                      boxShadow: "0 0 10px rgba(0,155,0,0.75)",
                      width: "50px",
                      height: "50px",
                      aspectRatio: "1/1",
                    }}
                    onClick={() => {
                      router.push(
                        "/community/u/" + blog.username,
                        "forward",
                        "push",
                      );
                    }}
                  />

                  <IonText>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: ".5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "1rem",
                        }}
                      >
                        <IonIcon ios={time} md={timeSharp} />
                        {new Date(blog.createdAt).toLocaleString()}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <IonIcon ios={pricetag} md={chatboxSharp} />
                        {blog.tags.join(", ")}
                      </div>
                    </div>
                  </IonText>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingTop: "1rem",
                    gap: "1rem",
                  }}
                >
                  <IonButton
                    size={"small"}
                    color={"success"}
                    fill={"outline"}
                    id={"create-comment"}
                  >
                    <IonIcon icon={chatbox} slot={"start"} />
                    {blog.comments.length}
                  </IonButton>
                  <IonPopover
                    trigger={"create-comment"}
                    triggerAction={"click"}
                    size={"auto"}
                    style={{
                      minWidth: "90%",
                    }}
                  >
                    <IonContent class={"ion-padding"}>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();

                          const content = (
                            (e.target as HTMLFormElement).elements.namedItem(
                              "comment",
                            ) as HTMLTextAreaElement
                          ).value;

                          const res = await REST.Community.commentBlogEntry(
                            localStorage.getItem("token") as string,
                            blog._id,
                            content,
                          );

                          if (res.status !== 200) {
                            PopupManager.alert({
                              title: "Fehler",
                              description:
                                "Die Aktion ist fehlgeschlagen: " +
                                res.payload.error,
                            });
                          } else {
                            reload();
                          }
                        }}
                      >
                        <IonTextarea
                          placeholder={"Kommentar"}
                          style={{
                            width: "100%",
                            maxHeight: "200px",
                          }}
                          autoGrow
                          name={"comment"}
                        />
                        <IonButton
                          type={"submit"}
                          color={"success"}
                          fill={"outline"}
                        >
                          <IonIcon icon={send} slot={"start"} />
                          Veröffentlichen
                        </IonButton>
                      </form>
                    </IonContent>
                  </IonPopover>
                  <IonButton
                    size={"small"}
                    onClick={async () => {
                      const res = await REST.Community.likeBlogEntry(
                        localStorage.getItem("token") as string,
                        blog._id,
                      );

                      if (res.status !== 200) {
                        PopupManager.alert({
                          title: "Fehler",
                          description:
                            "Die Aktion ist fehlgeschlagen: " +
                            res.payload.error,
                        });
                      } else {
                        await reload();
                      }
                    }}
                    color={
                      blog.likes.find((l) => l === userInfo.username)
                        ? "danger"
                        : "success"
                    }
                    fill={"outline"}
                  >
                    <IonIcon
                      icon={
                        blog.likes.find((l) => l === userInfo.username)
                          ? heart
                          : heartOutline
                      }
                      slot={"start"}
                    />
                    {blog.likes.length}
                  </IonButton>
                  {userInfo.username !== blog.username && (
                    <>
                      <IonButton
                        fill={"outline"}
                        color={"danger"}
                        size={"small"}
                        routerLink={
                          "/support?category=REPORT_POST&report_post=" +
                          blog._id
                        }
                      >
                        <IonIcon icon={flag} />
                      </IonButton>
                    </>
                  )}
                  {userInfo.username === blog.username ||
                  userInfo.role === "admin" ? (
                    <IonButton
                      color={"danger"}
                      fill={"outline"}
                      size={"small"}
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: "Löschen",
                            question:
                              "Möchtest du den Blog-Eintrag wirklich löschen?",
                          }))
                        )
                          return;

                        const res = await REST.Community.deleteBlogEntry(
                          localStorage.getItem("token") as string,
                          blog._id,
                        );

                        if (res.status !== 200) {
                          PopupManager.alert({
                            title: "Fehler",
                            description:
                              "Die Aktion ist fehlgeschlagen: " +
                              res.payload.error,
                          });
                        } else {
                          await router.push("/community", "back", "push");
                        }
                      }}
                    >
                      <IonIcon icon={trash} />
                    </IonButton>
                  ) : null}
                </div>
              </IonCardContent>
            </IonCard>
            <hr
              style={{
                backgroundColor: "var(--ion-color-success-shade)",
              }}
            />
            <IonText>
              <h1
                style={{
                  boxShadow: "0 0 10px rgba(0,155,0,0.75)",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                {blog?.title}
              </h1>
            </IonText>
            {mentions.length > 0 && (
              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <IonText>
                  <p>
                    <b>In diesem Beitrag sind folgende Konten verlinkt:</b>
                    {mentions.map((m) => {
                      return (
                        <>
                          <br />
                          <IonRouterLink routerLink={"/community/u/" + m}>
                            @{m}
                          </IonRouterLink>
                        </>
                      );
                    })}
                  </p>
                </IonText>
              </div>
            )}
            <ReactMarkdown children={blog.content} />
            <hr
              style={{
                marginTop: "20px",
                backgroundColor: "var(--ion-color-success-shade)",
              }}
            />
            <IonText>
              <h1
                style={{
                  boxShadow: "0 0 10px rgba(0,155,0,0.75)",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                Kommentare
              </h1>
            </IonText>
            {blog.comments
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              )
              .map((c) => {
                return (
                  <>
                    <IonCard
                      style={{
                        background: "transparent",
                        boxShadow: "0 0 10px rgba(0,155,0,0.75)",
                      }}
                    >
                      <IonCardHeader>
                        <IonCardSubtitle></IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "1rem",
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
                                c.username
                              }
                            />

                            <IonText>
                              <p>@{c.username}</p>
                              <p>{new Date(c.createdAt).toLocaleString()}</p>
                            </IonText>
                          </div>
                          {c.comment}
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </>
                );
              })}
          </>
        )}
      </Page>
    </>
  );
}
