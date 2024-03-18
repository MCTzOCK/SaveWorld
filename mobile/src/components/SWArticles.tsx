/**
 * mobile/src/components/SWArticles.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.02.2024
 *
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../util/PopupManager";
import { $$ } from "../translations/i18n";
import Page from "./Page";
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
import { IonButton, useIonRouter } from "@ionic/react";
import { translateOnlineV3 } from "../util/online-translate";

export default function SWArticles(props: { tag: string; pageTitle: string }) {
  const [articles, setArticles] = React.useState<
    {
      _id: string;
      title: string;
      featureImage: string;
      featureImageCPR: string;
      createdAt: string;
      tags: string[];
    }[]
  >([]);

  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(1);

  const reload = async () => {
    loadPage(page);
  };

  const loadPage = async (p: number) => {
    const res = await REST.Content.articles(p, props.tag);
    if (res.status !== 200) {
      PopupManager.alert({
        title: $$("control.error"),
        description: res.payload.error,
      });
      return;
    }
    const articles = res.payload.articles;

    if (window.language !== "de") {
      for (const a of articles) {
        a.title = await translateOnlineV3({
          from: "de",
          to: window.language,
          text: a.title,
        });
        a.content = await translateOnlineV3({
          from: "de",
          to: window.language,
          text: a.content,
        });
      }
    }
    setArticles(articles);
    setPages(res.payload.pages);
  };

  useEffect(() => {
    loadPage(page);
  }, [page]);

  useEffect(() => {
    loadPage(page);
  }, []);
  const router = useIonRouter();

  return (
    <>
      <Page title={props.pageTitle}>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
          gap={4}
        >
          {articles.map((a) => {
            return (
              <Card
                key={a._id}
                backgroundColor={
                  "var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)))"
                }
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
                <CardBody>
                  <ButtonGroup w={"100%"} mt={4}>
                    <Button
                      color={"brand.500"}
                      size={"lg"}
                      w={"100%"}
                      onClick={() => {
                        router.push("/articles/" + a._id);
                      }}
                    >
                      {$$("components.articles.read.more")}
                    </Button>
                  </ButtonGroup>
                </CardBody>
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
      </Page>
    </>
  );
}
