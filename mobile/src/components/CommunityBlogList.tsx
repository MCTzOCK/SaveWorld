/**
 * mobile/src/components/CommunityBlogList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.09.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";
import { chatbox, heart, pricetag } from "ionicons/icons";
import { Grid } from "@chakra-ui/react";

export default function CommunityBlogList(props: {
  blogs: {
    _id: string;
    username: string;
    title: string;
    content: string;
    tags: string[];
    likes: string[];
    comments: any[];
    createdAt: string;
    __v: number;
  }[];
  page: number;
  pages: number;
  setPage: (page: number) => void;
  showUsername?: boolean;
}) {
  return (
    <>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
      >
        {props.blogs.map((blog) => {
          return (
            <>
              <IonCard routerLink={"/community/r/" + blog._id}>
                <IonCardHeader>
                  <IonCardSubtitle>
                    {new Date(blog.createdAt).toLocaleString() +
                      " - " +
                      (props.showUsername ? blog.username : blog.title)}
                  </IonCardSubtitle>
                  {props.showUsername && (
                    <IonCardTitle>{blog.title}</IonCardTitle>
                  )}
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
