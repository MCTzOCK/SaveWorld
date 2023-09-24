/**
 * mobile/src/components/CommunityProfileBlogList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2023
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonIcon,
} from "@ionic/react";
import { chatbox, heart, pricetag } from "ionicons/icons";

export default function CommunityProfileBlogList(props: { username: string }) {
  const [page, setPage] = React.useState(0);

  const [blogs, setBlogs] = React.useState<
    {
      _id: string;
      username: string;
      title: string;
      content: string;
      tags: string[];
      likes: string[];
      comments: any[];
      createdAt: string;
      __v: number;
    }[]
  >([]);

  const [pages, setPages] = React.useState(0);

  const loadPage = async (p: number) => {
    const res = await REST.Community.blogEntries(
      localStorage.getItem("token") as string,
      props.username,
      p,
    );

    if (res.status === 200) {
      setBlogs(res.payload.entries);
      setPages(res.payload.pages);
    } else {
      alert("Blogs konnten nicht geladen werden: " + res.payload.error);
    }
  };

  useEffect(() => {
    loadPage(page);
  }, [props.username, page]);

  return (
    <>
      {blogs.map((blog) => {
        return (
          <>
            <IonCard routerLink={"/community/r/" + blog._id}>
              <IonCardHeader>
                <IonCardSubtitle>
                  {new Date(blog.createdAt).toLocaleString() +
                    " - " +
                    blog.title}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <IonIcon icon={pricetag} />
                  {blog.tags.join(", ")}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <IonIcon icon={heart} />
                  {blog.likes.length} Like{blog.likes.length === 1 ? "" : "s"}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <IonIcon icon={chatbox} />
                  {blog.comments.length} Kommentar
                  {blog.comments.length === 1 ? "" : "e"}
                </div>
              </IonCardContent>
            </IonCard>
          </>
        );
      })}
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
            Zurück
          </IonButton>
        ) : null}
        {page < pages - 1 ? (
          <IonButton
            color={"success"}
            onClick={() => setPage(page + 1)}
            expand={"block"}
          >
            Weiter
          </IonButton>
        ) : null}
      </div>
    </>
  );
}
