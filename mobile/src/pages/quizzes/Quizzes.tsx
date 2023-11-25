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
      .then((data) => {
        setQuizzes(data);
      });
  }, [query]);

  return (
    <>
      <Page title={"Quizze"}>
        <MobileBox>
          <IonSearchbar
            placeholder={"Suchen..."}
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
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
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
                        Beantworten
                      </Button>
                    </CardBody>
                  </Card>
                </>
              );
            })}
          </Grid>
        </MobileBox>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={["full", "full", "2xl"]}
          scrollBehavior={"inside"}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bgColor={"gray.900"}>
              <Heading fontSize={"xl"} fontWeight={1000}>
                Quiz Time!
              </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody bgColor={"gray.900"}>
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
                          <Button
                            color={"brand.500"}
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
                                title: "Ergebnis",
                                description:
                                  "Du hast " +
                                  (correct === answer ? "richtig" : "falsch") +
                                  " geantwortet!" +
                                  (correct !== answer
                                    ? "\n\nDie richtige Antwort ist: " +
                                      correctAnswer
                                    : ""),
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
                          </Button>
                        </>
                      );
                    })}
                  </Stack>
                </>
              ) : null}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Page>
    </>
  );
}
