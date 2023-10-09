/**
 * mobile/src/components/VideoDetailsModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.09.2023
 *
 */

import * as React from "react";
import { useEffect } from "react";
import {
  IonActionSheet,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { REST } from "@saveworld/api-js";
import { share, shareSharp, star, starSharp } from "ionicons/icons";
import { Share } from "@capacitor/share";
import PopupManager from "../util/PopupManager";
import { Text } from "@chakra-ui/react";

export default function VideoDetailsModal(props: {
  modal: React.RefObject<HTMLIonModalElement>;
  video: {
    title: string;
    description: string;
    categories: string[];
    _id: string;
    ratings: number[];
  } | null;
}) {
  const [categories, setCategories] = React.useState<
    {
      _id: string;
      name: string;
      description: string;
      image: string;
    }[]
  >([]);

  useEffect(() => {
    REST.Content.categories().then((res) => {
      if (res.status === 200) {
        setCategories(res.payload as any);
      }
    });
  }, []);

  const asRef = React.useRef<HTMLIonActionSheetElement>(null);

  const [page, setPage] = React.useState(0);

  const [comments, setComments] = React.useState<
    {
      _id: string;
      user: string;
      username: string;
      content: string;
      video: string;
      createdAt: string;
      __v: number;
    }[]
  >([]);

  const [pages, setPages] = React.useState(0);

  const loadPage = async (p: number) => {
    const res = await REST.Content.comments(
      props.video?._id as string,
      p,
      localStorage.getItem("token") as string,
    );

    if (res.status === 200) {
      setComments(res.payload.entries);
      setPages(res.payload.pages);
    } else {
      PopupManager.alert({
        title: "Fehler",
        description:
          "Kommentare konnten nicht geladen werden: " + res.payload.error,
      });
    }
  };

  useEffect(() => {
    if (!props.video) return;

    loadPage(page);
  }, [props.video, page]);

  return (
    <>
      <IonModal
        ref={props.modal}
        initialBreakpoint={0.4}
        breakpoints={[0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot={"start"}>
              <IonButton
                color={"success"}
                onClick={async () => {
                  await Share.share({
                    title: props.video?.title,
                    text: props.video?.description,
                    url:
                      "https://app.saveworld.one/learn?vid=" + props.video?._id,
                  });
                }}
              >
                <IonIcon ios={share} md={shareSharp} />
              </IonButton>
              <IonButton
                color={"success"}
                onClick={async () => {
                  asRef.current?.present();
                }}
              >
                <IonIcon ios={star} md={starSharp} />
              </IonButton>
            </IonButtons>
            <IonTitle>{props.video?.title}</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton
                color={"success"}
                onClick={() => {
                  props.modal.current?.dismiss();
                }}
              >
                <b>Fertig</b>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonActionSheet
            ref={asRef}
            header={"Bewerten"}
            subHeader={"Wie viele Sterne hat das Video verdient?"}
            buttons={[
              {
                text: "1 Stern",
                data: {
                  rating: 1,
                },
              },
              {
                text: "2 Sterne",
                data: {
                  rating: 2,
                },
              },
              {
                text: "3 Sterne",
                data: {
                  rating: 3,
                },
              },
              {
                text: "4 Sterne",
                data: {
                  rating: 4,
                },
              },
              {
                text: "5 Sterne",
                data: {
                  rating: 5,
                },
              },
              {
                text: "Abbrechen",
                role: "cancel",
              },
            ]}
            onDidDismiss={async (e) => {
              if (e.detail.role === "cancel") return;
              const rating = e.detail.data.rating;

              const res = await REST.Content.rate(
                props.video?._id as string,
                rating,
              );

              if (res.status === 200) {
                PopupManager.alert({
                  title: "Danke!",
                  description: "Vielen Dank für deine Bewertung!",
                });
              } else {
                PopupManager.alert({
                  title: "Fehler!",
                  description:
                    "Fehler beim Bewerten des Videos: " + res.payload.error,
                });
              }
            }}
          />
          {props.video ? (
            <div className={"ion-padding"}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <IonIcon
                  ios={star}
                  md={starSharp}
                  color={
                    (Math.round(
                      (props.video?.ratings as number[]).reduce(
                        (a, b) => a + b,
                        0,
                      ) / (props.video?.ratings as number[]).length,
                    ) || 0) > 0
                      ? "warning"
                      : "medium"
                  }
                />
                <IonIcon
                  ios={star}
                  md={starSharp}
                  color={
                    (Math.round(
                      (props.video?.ratings as number[]).reduce(
                        (a, b) => a + b,
                        0,
                      ) / (props.video?.ratings as number[]).length,
                    ) || 0) > 1
                      ? "warning"
                      : "medium"
                  }
                />
                <IonIcon
                  ios={star}
                  md={starSharp}
                  color={
                    (Math.round(
                      (props.video?.ratings as number[]).reduce(
                        (a, b) => a + b,
                        0,
                      ) / (props.video?.ratings as number[]).length,
                    ) || 0) > 2
                      ? "warning"
                      : "medium"
                  }
                />
                <IonIcon
                  ios={star}
                  md={starSharp}
                  color={
                    (Math.round(
                      (props.video?.ratings as number[]).reduce(
                        (a, b) => a + b,
                        0,
                      ) / (props.video?.ratings as number[]).length,
                    ) || 0) > 3
                      ? "warning"
                      : "medium"
                  }
                />
                <IonIcon
                  ios={star}
                  md={starSharp}
                  color={
                    (Math.round(
                      (props.video?.ratings as number[]).reduce(
                        (a, b) => a + b,
                        0,
                      ) / (props.video?.ratings as number[]).length,
                    ) || 0) > 4
                      ? "warning"
                      : "medium"
                  }
                />
                (
                {Math.round(
                  (props.video?.ratings as number[]).reduce(
                    (a, b) => a + b,
                    0,
                  ) / (props.video?.ratings as number[]).length,
                ) || "0"}
                )
              </div>
              <IonText>{props.video?.description}</IonText>
              {props.video?.categories.map((category) => {
                return (
                  <>
                    <IonCard>
                      <img
                        src={categories.find((c) => c._id === category)?.image}
                      />
                      <IonCardHeader>
                        <IonCardTitle>
                          {categories.find((c) => c._id === category)!.name}
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        {
                          categories.find((c) => c._id === category)!
                            .description
                        }
                      </IonCardContent>
                    </IonCard>
                  </>
                );
              })}
            </div>
          ) : null}
          <IonText>
            <h1
              style={{
                textAlign: "center",
              }}
            >
              Kommentare &nbsp;
              <IonButton
                color={"success"}
                size={"small"}
                onClick={async () => {
                  props.modal.current?.dismiss();
                  const content = await PopupManager.promptAsync({
                    title: "Video Kommentieren",
                    inputType: "INPUT",
                    helperText: "Gib dein Kommentar ein",
                  });
                  props.modal.current?.present();

                  if (!content) return;

                  const res = await REST.Content.comment(
                    props.video?._id as string,
                    content as string,
                    localStorage.getItem("token") as string,
                  );

                  if (res.status === 200) {
                    setPage(0);
                    loadPage(0);
                  } else {
                    await PopupManager.alertAsync({
                      title: "Fehler",
                      description:
                        "Das Kommentar konnte nicht veröffentlicht werden: " +
                        res.payload.error,
                    });
                  }
                }}
              >
                Kommentieren
              </IonButton>
            </h1>
          </IonText>
          {comments && comments.length > 0 ? (
            <>
              {comments.map((comment) => {
                return (
                  <IonCard>
                    <IonCardHeader>
                      <IonCardSubtitle>
                        {new Date(comment.createdAt).toLocaleString()}
                      </IonCardSubtitle>
                      <IonCardTitle>{comment.username}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>{comment.content}</IonCardContent>
                  </IonCard>
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
          ) : (
            <>
              <Text textAlign={"center"}>
                Es gib noch keine Kommentare zu diesem Video.
              </Text>
            </>
          )}
        </IonContent>
      </IonModal>
    </>
  );
}
