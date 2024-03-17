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
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { REST } from "@saveworld/api-js/index";
import { share, shareSharp, star, starSharp } from "ionicons/icons";
import { Share } from "@capacitor/share";
import PopupManager from "../util/PopupManager";
import { Button, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { FaGlobe } from "react-icons/fa";
import { $$ } from "../translations/i18n";

export default function VideoDetailsModal(props: {
  modal: React.RefObject<HTMLIonModalElement>;
  video: {
    title: string;
    description: string;
    categories: string[];
    _id: string;
    ratings: number[];
    sources: string[];
  } | null;
}) {
  const router = useIonRouter();
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
      console.log(res);
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
        title: $$("control.error"),
        description: $$(
          "components.video.modal.comments.loading.error",
          res.payload.error,
        ),
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
          <IonToolbar
            style={{
              "--background": "var(--chakra-colors-gray-900)",
            }}
          >
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
                <b>{$$("general.finished")}</b>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent
          style={{
            "--background": "var(--chakra-colors-gray-800)",
          }}
        >
          <IonActionSheet
            ref={asRef}
            header={$$("general.rate")}
            subHeader={$$("components.video.modal.rate.how.stars")}
            buttons={[
              {
                text: "1 " + $$("general.star"),
                data: {
                  rating: 1,
                },
              },
              {
                text: "2 " + $$("general.stars"),
                data: {
                  rating: 2,
                },
              },
              {
                text: "3 " + $$("general.stars"),
                data: {
                  rating: 3,
                },
              },
              {
                text: "4 " + $$("general.stars"),
                data: {
                  rating: 4,
                },
              },
              {
                text: "5 " + $$("general.stars"),
                data: {
                  rating: 5,
                },
              },
              {
                text: $$("control.cancel"),
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
                  title: $$("general.thanks"),
                  description: $$("components.video.modal.rate.success"),
                });
              } else {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$(
                    "components.video.modal.rate.error",
                    res.payload.error,
                  ),
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
              <br />
              <IonText>
                <b>{$$("components.video.create.sources")}</b>
                <List>
                  {props.video?.sources.map((source) => {
                    return (
                      <ListItem>
                        <ListIcon as={FaGlobe} color="green.500" />
                        {source}
                      </ListItem>
                    );
                  })}
                </List>
              </IonText>
              <Button
                color={"brand.500"}
                mt={2}
                w={"100%"}
                onClick={() => {
                  router.push(
                    "/support?category=VIDEO_QUESTION&videoId=" +
                      props.video?._id,
                  );
                  props.modal.current?.dismiss();
                }}
              >
                {$$("components.video.modal.ask.question")}
              </Button>
              {props.video?.categories.map((category) => {
                if (!categories.find((c) => c._id === category)) {
                  return null;
                }

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
              {$$("pages.community.blog.comments")} &nbsp;
              <IonButton
                color={"success"}
                size={"small"}
                onClick={async () => {
                  props.modal.current?.dismiss();
                  const content = await PopupManager.promptAsync({
                    title: $$("components.video.modal.comment"),
                    inputType: "INPUT",
                    helperText: $$("components.video.modal.comment.enter"),
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
                      title: $$("control.error"),
                      description: $$(
                        "components.video.modal.comment.error",
                        res.payload.error,
                      ),
                    });
                  }
                }}
              >
                {$$("components.video.modal.comment.submit")}
              </IonButton>
            </h1>
          </IonText>
          {comments && comments.length > 0 ? (
            <>
              {comments.map((comment) => {
                return (
                  <IonCard
                    style={{
                      "--background": "var(--chakra-colors-gray-900)",
                    }}
                  >
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
            </>
          ) : (
            <>
              <Text textAlign={"center"}>
                {$$("components.video.modal.comments.no")}
              </Text>
            </>
          )}
        </IonContent>
      </IonModal>
    </>
  );
}
