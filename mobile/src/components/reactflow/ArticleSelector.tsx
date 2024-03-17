/**
 * mobile/src/components/reactflow/ArticleSelector.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.03.2024
 *
 */

import * as React from "react";
import SaveWorldModal from "../SaveWorldModal";
import { MVideo } from "../../types";
import { $$ } from "../../translations/i18n";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../../util/PopupManager";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
} from "@ionic/react";
import { translateOnlineV3 } from "../../util/online-translate";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Image,
} from "@chakra-ui/react";
import { showQuiz } from "../../util/quizzes";

export default function ArticleSelector(props: {
  onClose: () => void;
  isOpen: boolean;
  onSelection: (article: {
    _id: string;
    title: string;
    featureImage: string;
    featureImageCPR: string;
    content: string;
    tags: string[];
  }) => void;
}) {
  const [articles, setArticles] = useState<
    {
      _id: string;
      title: string;
      featureImage: string;
      featureImageCPR: string;
      content: string;
      tags: string[];
    }[]
  >([]);

  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(1);

  const reload = async () => {
    loadPage(page);
  };

  const loadPage = async (p: number) => {
    const res = await REST.Content.articles(p, "");
    if (res.status !== 200) {
      PopupManager.alert({
        title: $$("control.error"),
        description: res.payload.error,
      });
      return;
    }

    setArticles(res.payload.articles);
    setPages(res.payload.pages);
  };

  useEffect(() => {
    loadPage(page);
  }, [page]);

  useEffect(() => {
    loadPage(page);
  }, []);
  return (
    <SaveWorldModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={$$("components.learning.graphs.select.article.title")}
    >
      <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6}>
        {articles.map((a) => {
          return (
            <Card
              backgroundColor={
                "var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)))"
              }
              cursor={"pointer"}
              onClick={() => {
                props.onSelection(a);
                props.onClose();
              }}
            >
              <CardHeader>
                <Image src={a.featureImage} rounded={"md"} mb={2} />
                <p>
                  <b>{$$("components.articles.source")}</b>:{" "}
                  <i>{a.featureImageCPR}</i>
                  <br />
                  <b>{$$("pages.admin.articles.new.tags")}</b>:{" "}
                  {a.tags.join(", ")}
                </p>
                <Heading size={"lg"}>{a.title}</Heading>
              </CardHeader>
            </Card>
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
    </SaveWorldModal>
  );
}
