/**
 * mobile/src/components/reactflow/QuizSelector.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.02.2024
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
import { Card, CardHeader, Grid, Heading, Image } from "@chakra-ui/react";
import { showQuiz } from "../../util/quizzes";

export default function QuizSelector(props: {
  onClose: () => void;
  isOpen: boolean;
  onSelection: (quiz: {
    _id: string;
    title: string;
    featureImage: string;
    answers: string[];
    correctAnswer: number;
  }) => void;
}) {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);

  const [quizzes, setQuizzes] = React.useState<
    {
      _id: string;
      title: string;
      featureImage: string;
      answers: string[];
      correctAnswer: number;
    }[]
  >([]);

  useEffect(() => {
    setPage(0);
  }, []);

  useEffect(() => {
    REST.Content.quizzes(page, query).then(async (res) => {
      const quizzes = res.payload.quizzes;
      if (window.language !== "de") {
        for (const q of quizzes) {
          q.title = await translateOnlineV3({
            text: q.title,
            from: "de",
            to: window.language,
          });
          for (let a of q.answers) {
            a = await translateOnlineV3({
              text: a,
              from: "de",
              to: window.language,
            });
          }
        }
      }
      setQuizzes(quizzes);
      setPages(res.payload.pages);
    });
  }, [page, query]);

  useEffect(() => {
    setPage(0);
    setPages(0);
  }, [query]);
  return (
    <SaveWorldModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={$$("components.learning.graphs.select.quiz.title")}
    >
      <IonSearchbar
        value={query}
        onIonInput={(e) => setQuery(e.detail.value!)}
        placeholder={$$("control.search")}
        style={{ padding: "0" }}
      />
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        gap={6}
      >
        {quizzes.map((quiz) => (
          <Card
            backgroundColor={
              "var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)))"
            }
            cursor={"pointer"}
            onClick={async () => {
              props.onSelection(quiz);
            }}
          >
            <CardHeader>
              <Image src={quiz.featureImage} rounded={"md"} w={"100%"} />
              <Heading size={"md"}>{quiz.title}</Heading>
            </CardHeader>
          </Card>
        ))}
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
