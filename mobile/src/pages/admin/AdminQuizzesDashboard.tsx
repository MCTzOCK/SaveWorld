/**
 * mobile/src/pages/admin/AdminQuizzesDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 26.02.2024
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Select,
  Stack,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";
import { FaCheck, FaPlus, FaTrash } from "react-icons/fa6";
import SaveWorldModal from "../../components/SaveWorldModal";
import { uploadImage } from "../../util/files";
import { ENDPOINT } from "../../env";
import { FaImage } from "react-icons/fa";
import { IonButton } from "@ionic/react";

export default function AdminQuizzesDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [currentQuiz, setCurrentQuiz] = useState<{
    _id?: string;
    title: string;
    featureImage: string;
    answers: string[];
    correctAnswer: number;
  } | null>({
    title: "",
    featureImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAZCAYAAADe3PCBAAAAUUlEQVR42u3UQQEAAAQEMJKLflJ42UKsK5kCXmoBgAAAAQACAAQACAAQACAAQACAAAABAAIABAAIABAAIABAAIAAAAEAAgAEAAgAEAAgAODMAnX1Pk/7BPEvAAAAAElFTkSuQmCC",
    answers: [],
    correctAnswer: 0,
  });

  const [quizzes, setQuizzes] = useState<
    {
      _id: string;
      title: string;
      answers: string[];
      correctAnswer: number;
      featureImage: string;
    }[]
  >([]);
  const [action, setAction] = useState<"create" | "edit">("create");

  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(1);

  const reload = async () => {
    loadPage(page);
  };

  const loadPage = async (p: number) => {
    const res = await REST.Content.quizzes(p, "");
    if (res.status !== 200) {
      PopupManager.alert({
        title: $$("control.error"),
        description: res.payload.error,
      });
      return;
    }

    setQuizzes(res.payload.quizzes);
    setPages(res.payload.pages);
  };

  useEffect(() => {
    loadPage(page);
  }, [page]);

  useEffect(() => {
    loadPage(page);
  }, []);

  return (
    <>
      <Page title={$$("menu.quizzes")} redGradient>
        <Flex w={"100%"} alignItems={"center"} justifyContent={"flex-end"}>
          <Button
            color={"red.500"}
            leftIcon={<FaPlus />}
            size={"lg"}
            onClick={() => {
              onOpen();
              setAction("create");
            }}
          >
            {$$("pages.admin.quizzes.new")}
          </Button>
        </Flex>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)",
          ]}
          gap={4}
        >
          {quizzes.map((a) => {
            return (
              <Card
                backgroundColor={
                  "var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)))"
                }
              >
                <CardHeader>
                  <Image src={a.featureImage} rounded={"md"} mb={2} />
                  <Heading size={"lg"}>{a.title}</Heading>
                </CardHeader>
                <CardBody>
                  {a.answers.map((ans, i) => {
                    return (
                      <HStack>
                        <p>
                          {i + 1}. {ans}{" "}
                        </p>
                        {a.correctAnswer === i ? <FaCheck /> : null}
                      </HStack>
                    );
                  })}
                  <ButtonGroup w={"100%"} mt={4}>
                    <Button
                      color={"brand.500"}
                      w={"100%"}
                      onClick={() => {
                        setCurrentQuiz({
                          featureImage: a.featureImage,
                          _id: a._id,
                          title: a.title,
                          answers: a.answers,
                          correctAnswer: a.correctAnswer,
                        });
                        setAction("edit");
                        onOpen();
                      }}
                    >
                      {$$("general.edit")}
                    </Button>
                    <Button
                      color={"red.500"}
                      w={"100%"}
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: $$("control.delete"),
                            question: $$("pages.admin.quizzes.delete.confirm"),
                          }))
                        )
                          return;

                        const res = await REST.Admin.deleteQuiz(
                          localStorage.getItem("token") as string,
                          a._id,
                        );

                        if (res.status !== 200) {
                          PopupManager.alert({
                            title: $$("control.error"),
                            description: res.payload.error,
                          });
                          return;
                        }

                        reload();
                      }}
                    >
                      {$$("control.delete")}
                    </Button>
                  </ButtonGroup>
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      </Page>
      <SaveWorldModal
        title={
          action === "create"
            ? $$("pages.admin.quizzes.new")
            : $$("general.edit")
        }
        isOpen={isOpen}
        onClose={onClose}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (action === "create") {
              const res = await REST.Admin.createQuiz(
                localStorage.getItem("token") as string,
                currentQuiz?.title || "",
                currentQuiz?.answers || [],
                currentQuiz?.correctAnswer || 0,
                currentQuiz?.featureImage || "",
              );

              if (res.status !== 200) {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: res.payload.error,
                });
                return;
              }

              onClose();
              reload();
            } else {
              const res = await REST.Admin.updateQuiz(
                localStorage.getItem("token") as string,
                currentQuiz?._id || "",
                currentQuiz?.title || "",
                currentQuiz?.answers || [],
                currentQuiz?.correctAnswer || 0,
                currentQuiz?.featureImage || "",
              );

              if (res.status !== 200) {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: res.payload.error,
                });
                return;
              }

              onClose();

              reload();
            }
          }}
        >
          {currentQuiz && (
            <Stack spacing={4} mb={2}>
              <Image
                src={
                  currentQuiz
                    ? currentQuiz.featureImage
                    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAZCAYAAADe3PCBAAAAUUlEQVR42u3UQQEAAAQEMJKLflJ42UKsK5kCXmoBgAAAAQACAAQACAAQACAAQACAAAABAAIABAAIABAAIABAAIAAAAEAAgAEAAgAEAAgAODMAnX1Pk/7BPEvAAAAAElFTkSuQmCC"
                }
                rounded={"md"}
                cursor={"pointer"}
                onClick={async () => {
                  uploadImage((url) => {
                    setCurrentQuiz({
                      featureImage: ENDPOINT + url,
                      _id: currentQuiz?._id,
                      title: currentQuiz?.title || "",
                      answers: currentQuiz?.answers || [],
                      correctAnswer: currentQuiz?.correctAnswer || 0,
                    });
                  });
                }}
              />
              <FormControl isRequired>
                <FormLabel>{$$("pages.admin.video.form.title")}</FormLabel>
                <Input
                  type={"text"}
                  placeholder={$$("pages.admin.video.form.title")}
                  value={currentQuiz?.title}
                  onChange={(e) => {
                    setCurrentQuiz({
                      featureImage: currentQuiz?.featureImage || "",
                      _id: currentQuiz?._id,
                      title: e.target.value,
                      answers: currentQuiz?.answers || [],
                      correctAnswer: currentQuiz?.correctAnswer || 0,
                    });
                  }}
                />
              </FormControl>
              <Stack spacing={4}>
                {currentQuiz.answers.map((a, i) => {
                  return (
                    <FormControl isRequired>
                      <FormLabel>
                        {$$("pages.admin.quizzes.new.answer.text")} {i + 1}
                      </FormLabel>
                      <HStack>
                        <Input
                          type={"text"}
                          value={a}
                          placeholder={$$(
                            "pages.admin.quizzes.new.answer.text",
                          )}
                          onChange={(e) => {
                            const newAnswers = currentQuiz?.answers || [];
                            newAnswers[i] = e.target.value;
                            setCurrentQuiz({
                              featureImage: currentQuiz?.featureImage || "",
                              _id: currentQuiz?._id,
                              title: currentQuiz?.title || "",
                              answers: newAnswers,
                              correctAnswer: currentQuiz?.correctAnswer || 0,
                            });
                          }}
                        />
                        <IconButton
                          aria-label={"Delete"}
                          icon={<FaTrash />}
                          onClick={() => {
                            const newAnswers = currentQuiz?.answers || [];
                            newAnswers.splice(i, 1);
                            setCurrentQuiz({
                              featureImage: currentQuiz?.featureImage || "",
                              _id: currentQuiz?._id,
                              title: currentQuiz?.title || "",
                              answers: newAnswers,
                              correctAnswer: currentQuiz?.correctAnswer || 0,
                            });
                          }}
                          colorScheme={"red"}
                        />
                      </HStack>
                    </FormControl>
                  );
                })}
              </Stack>
              <FormControl isRequired>
                <FormLabel>
                  {$$("pages.admin.quizzes.new.answer.correct")}
                </FormLabel>
                <Select
                  value={currentQuiz.correctAnswer}
                  onChange={(e) => {
                    setCurrentQuiz({
                      featureImage: currentQuiz?.featureImage || "",
                      _id: currentQuiz?._id,
                      title: currentQuiz?.title || "",
                      answers: currentQuiz?.answers || [],
                      correctAnswer: parseInt(e.target.value),
                    });
                  }}
                >
                  {currentQuiz.answers.map((a, i) => {
                    return (
                      <option value={i}>
                        {$$("pages.admin.quizzes.new.answer.text") +
                          " " +
                          (i + 1)}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <Button
                variant={"brand"}
                leftIcon={<FaPlus />}
                onClick={() => {
                  const newAnswers = currentQuiz?.answers || [];
                  newAnswers.push("");
                  setCurrentQuiz({
                    featureImage: currentQuiz?.featureImage || "",
                    _id: currentQuiz?._id,
                    title: currentQuiz?.title || "",
                    answers: newAnswers,
                    correctAnswer: currentQuiz?.correctAnswer || 0,
                  });
                }}
              >
                {$$("pages.admin.quizzes.new.answer")}
              </Button>
              <Button type={"submit"} variant={"brand"}>
                {action === "create"
                  ? $$("pages.admin.quizzes.new")
                  : $$("general.edit")}
              </Button>
            </Stack>
          )}
        </form>
      </SaveWorldModal>

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
  );
}
