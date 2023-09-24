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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { ENDPOINT } from "../../env";
import {
  chatbox,
  chatboxSharp,
  heart,
  heartOutline,
  heartSharp,
  time,
  timeSharp,
  watch,
  watchSharp,
} from "ionicons/icons";
import ReactMarkdown from "react-markdown";
import { useUserData } from "../../hooks/useUserData";
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

  const reload = async () => {
    const res = await REST.Community.blogEntry(
      localStorage.getItem("token") as string,
      id,
    );

    if (res.status === 200) {
      setBlog(res.payload.entry);
    } else {
      alert("Blog nicht gefunden!");
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
      alert("Profil nicht gefunden!");
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
                  <IonAvatar
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
                  >
                    <img
                      src={
                        ENDPOINT +
                        "/media/profile-picture-username/" +
                        blog.username
                      }
                    />
                  </IonAvatar>
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
                        <IonIcon ios={heart} md={heartSharp} />
                        {blog.likes.length + " Likes"}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <IonIcon ios={chatbox} md={chatboxSharp} />
                        {blog.comments.length + " Kommentare"}
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
                    onClick={async () => {
                      const res = await REST.Community.likeBlogEntry(
                        localStorage.getItem("token") as string,
                        blog._id,
                      );

                      if (res.status !== 200) {
                        alert(
                          "Die Aktion ist fehlgeschlagen: " + res.payload.error,
                        );
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
                    />
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
            <hr
              style={{
                backgroundColor: "var(--ion-color-success-shade)",
              }}
            />
            <IonText>
              <h1>{blog?.title}</h1>
            </IonText>
            <ReactMarkdown children={blog.content} />
          </>
        )}
      </Page>
    </>
  );
}
