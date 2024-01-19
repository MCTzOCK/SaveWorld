/**
 * mobile/src/pages/quizzes/Quizzes.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.11.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import MobileBox from "../../components/MobileBox";
import { useEffect, useState } from "react";
import { readItems } from "@directus/sdk";
import { DIRECTUS_ENDPOINT, getDirectusApi } from "../../env";
import { IonSearchbar } from "@ionic/react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import ManageAccountInterests from "../../components/ManageAccountInterests";
import PopupManager from "../../util/PopupManager";
import SaveWorldModal from "../../components/SaveWorldModal";
import { $$ } from "../../translations/i18n";
import {
  translateOnline,
  translateOnlineV3,
} from "../../util/online-translate";

export default function Quizzes() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState<string>("");

  const [quizzes, setQuizzes] = useState<
    {
      id: string;
      user_created: string;
      date_created: string;
      question: string;
      answer_1: string;
      answer_2: string;
      answer_3: string;
      answer_4: string;
      image: string;
      correct: number;
    }[]
  >([]);

  const [currentQuiz, setCurrentQuiz] = useState<string>("");

  useEffect(() => {
    getDirectusApi()
      .request(
        readItems(
          "Quizzes",
          query
            ? {
                filter: {
                  question: {
                    _contains: query,
                  },
                },
              }
            : undefined,
        ),
      )
      .then(async (data) => {
        let newQuizzes = [];

        for (let quiz of data) {
          let question = quiz.question;
          let answer_1 = quiz.answer_1;
          let answer_2 = quiz.answer_2;
          let answer_3 = quiz.answer_3;
          let answer_4 = quiz.answer_4;

          if (window.language !== "de") {
            question = await translateOnlineV3({
              text: question,
              to: window.language,
            });
            answer_1 = await translateOnlineV3({
              text: answer_1,
              to: window.language,
            });
            answer_2 = await translateOnlineV3({
              text: answer_2,
              to: window.language,
            });
            answer_3 = await translateOnlineV3({
              text: answer_3,
              to: window.language,
            });
            answer_4 = await translateOnlineV3({
              text: answer_4,
              to: window.language,
            });
          }

          newQuizzes.push({
            ...quiz,
            question: question,
            answer_1: answer_1,
            answer_2: answer_2,
            answer_3: answer_3,
            answer_4: answer_4,
          });
        }

        setQuizzes(newQuizzes);
      });
  }, [query]);

  return (
    <>
      <Page title={$$("menu.quizzes")}>
        <IonSearchbar
          placeholder={$$("control.search")}
          onIonInput={(e) => {
            setQuery(e.detail.value || "");
          }}
          style={{
            padding: 0,
          }}
        />
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)",
            "repeat(5, 1fr)",
          ]}
          gap={6}
        >
          {quizzes.map((quiz) => {
            return (
              <>
                <Card bgColor={"gray.800"}>
                  <Image
                    src={DIRECTUS_ENDPOINT + "/assets/" + quiz.image}
                    rounded={"lg"}
                  />
                  <CardHeader fontSize={"lg"}>{quiz.question}</CardHeader>
                  <CardBody>
                    <Button
                      color={"brand.500"}
                      w={"100%"}
                      onClick={() => {
                        setCurrentQuiz(quiz.id);
                        onOpen();
                      }}
                    >
                      {$$("pages.quizzes.answer")}
                    </Button>
                  </CardBody>
                </Card>
              </>
            );
          })}
        </Grid>
        <SaveWorldModal
          title={$$("pages.quizzes.quiz.time")}
          isOpen={isOpen}
          onClose={onClose}
        >
          {currentQuiz ? (
            <>
              <Heading size={"md"}>
                {
                  quizzes.filter((quiz) => {
                    return quiz.id == currentQuiz;
                  })[0].question
                }
              </Heading>
              <Stack>
                {[1, 2, 3, 4].map((answer) => {
                  return (
                    <>
                      <Box
                        rounded={"lg"}
                        color={"brand.500"}
                        backgroundColor={"gray.800"}
                        p={4}
                        fontSize={"lg"}
                        cursor={"pointer"}
                        w={"100%"}
                        onClick={() => {
                          const correct = quizzes.filter((quiz) => {
                            return quiz.id == currentQuiz;
                          })[0].correct;
                          const correctAnswer = (
                            quizzes.filter((quiz) => {
                              return quiz.id == currentQuiz;
                            })[0] as any
                          )["answer_" + correct] as string;

                          PopupManager.alertAsync({
                            title: $$("pages.quizzes.result"),
                            description: $$(
                              "pages.quizzes.result.description",
                              correct === answer
                                ? $$("general.correct")
                                : $$("general.wrong"),
                              correct !== answer
                                ? "\n\n" +
                                    $$(
                                      "pages.quizzes.result.2",
                                      correctAnswer.toString(),
                                    )
                                : "",
                            ),
                          });
                          onClose();
                        }}
                      >
                        {
                          (
                            quizzes.filter((quiz) => {
                              return quiz.id == currentQuiz;
                            })[0] as any
                          )["answer_" + answer] as string
                        }
                      </Box>
                    </>
                  );
                })}
              </Stack>
            </>
          ) : null}
        </SaveWorldModal>
      </Page>
    </>
  );
}
