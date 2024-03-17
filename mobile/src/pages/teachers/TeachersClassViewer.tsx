/**
 * mobile/src/pages/teachers/TeachersClassViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 07.03.2024
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";
import MobileBox from "../../components/MobileBox";
import { useParams } from "react-router";
import { REST } from "@saveworld/api-js/REST";
import PopupManager from "../../util/PopupManager";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import SchoolClassesList from "../../components/SchoolClassesList";
import { FaPlus, FaTrash } from "react-icons/fa6";
import schoolClassModel from "../../../../backend2/src/models/SchoolClassModel";
import TeachersClassPermissions from "../../components/TeachersClassPermissions";
import { useIonRouter } from "@ionic/react";
import { MVideo } from "../../types";
import VideoSelector from "../../components/reactflow/VideoSelector";
import ArticleSelector from "../../components/reactflow/ArticleSelector";

export default function TeachersClassViewer() {
  useRedirectForAnon();
  const { id } = useParams<{ id: string }>();

  const [c, sc] = React.useState<{
    _id: string;
    createdAt: string;
    createdBy: string;
    name: string;
    students: {
      _id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      active: boolean;
      role: string;
      createdAt: string;
      password: string;
      __v: number;
    }[];
    homepage: string;
    recommendedVideos: MVideo[];
    recommendedArticles: {
      _id: string;
      title: string;
      content: string;
      featureImage: string;
      featureImageCPR: string;
      createdAt: string;
      tags: string[];
    }[];
  } | null>(null);

  const reloadClass = async () => {
    const res = await REST.School.class(
      localStorage.getItem("token") as string,
      id,
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: $$("control.error"),
        description: res.payload.error,
      });
      return;
    }
    sc(res.payload.schoolClass);
  };

  useEffect(() => {
    reloadClass();
  }, []);

  const {
    isOpen: isVOpen,
    onOpen: onVOpen,
    onClose: onVClose,
  } = useDisclosure();
  const {
    isOpen: isAOpen,
    onOpen: onAOpen,
    onClose: onAClose,
  } = useDisclosure();

  const onVSelection = async (video: MVideo & { _id: string }) => {
    onVClose();
    const recommendedVideos: string[] = c!.recommendedVideos
      ? (c?.recommendedVideos.map((v) => (v as any)._id) as string[])
      : ([] as string[]);
    recommendedVideos.push(video._id);

    const res = await REST.School.updateRecommendedContent(
      localStorage.getItem("token") as string,
      id,
      recommendedVideos,
      c?.recommendedArticles.map((a) => a._id) || [],
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: $$("control.error"),
        description: res.payload.error,
      });
      return;
    }

    await reloadClass();
  };

  const onASelection = async (article: {
    _id: string;
    title: string;
    featureImage: string;
    featureImageCPR: string;
    content: string;
    tags: string[];
  }) => {
    onAClose();
    const recommendedArticles: string[] = c!.recommendedArticles
      ? (c?.recommendedArticles.map((v) => (v as any)._id) as string[])
      : ([] as string[]);
    recommendedArticles.push(article._id);
    const res = await REST.School.updateRecommendedContent(
      localStorage.getItem("token") as string,
      id,
      c?.recommendedVideos.map((v) => (v as any)._id) || [],
      recommendedArticles,
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: $$("control.error"),
        description: res.payload.error,
      });
      return;
    }

    await reloadClass();
  };

  const router = useIonRouter();
  return (
    <Page title={c !== null ? c.name : $$("pages.teachers.my.class")}>
      <MobileBox>
        {c === null ? (
          <>
            <Flex
              w={"100%"}
              h={"100vh"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Spinner size={"xl"} color={"brand.500"} />
            </Flex>
          </>
        ) : (
          <>
            <Tabs colorScheme={"brand"} size={"md"} isFitted>
              <TabList>
                <Tab>{$$("menu.home")}</Tab>
                <Tab>{$$("pages.teachers.classes.students")}</Tab>
                <Tab>{$$("pages.teachers.classes.permissions")}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0} pt={2}>
                  {$$("pages.teachers.classes.intro")}
                  <Stack spacing={4} p={0} mt={3}>
                    <Box
                      bg={"gray.900"}
                      rounded={"md"}
                      shadow={"xl"}
                      p={3}
                      pt={0}
                    >
                      <Heading size={"md"}>
                        {$$("pages.e2projects.homepage")}
                      </Heading>
                      <Text>{$$("pages.teachers.classes.homepage")}</Text>

                      <RadioGroup
                        onChange={async (e) => {
                          const res = await REST.School.updateHomepage(
                            localStorage.getItem("token") as string,
                            id,
                            e,
                          );

                          if (res.status !== 200) {
                            await PopupManager.alertAsync({
                              title: $$("control.error"),
                              description: res.payload.error,
                            });
                            return;
                          }

                          await reloadClass();
                        }}
                        value={c.homepage}
                      >
                        <VStack
                          spacing={2}
                          justifyContent={"flex-start"}
                          alignItems={"left"}
                        >
                          <Radio value={"saveworld.default.homepage"}>
                            {$$("pages.teachers.classes.homepage.default")}
                          </Radio>
                          <Radio value={"saveworld.students.class.homepage"}>
                            {$$("pages.teachers.classes.homepage.class")}
                          </Radio>
                        </VStack>
                      </RadioGroup>
                    </Box>
                    <Box
                      bg={"gray.900"}
                      rounded={"md"}
                      shadow={"xl"}
                      p={3}
                      pt={0}
                    >
                      <Heading size={"md"}>
                        {$$("pages.teachers.recommended.content")}
                      </Heading>
                      <Text>
                        {$$("pages.teachers.recommended.content.desc")}
                      </Text>
                      <ButtonGroup w={"100%"}>
                        <Button
                          variant={"brand"}
                          w={"100%"}
                          size={"sm"}
                          onClick={() => {
                            onVOpen();
                          }}
                        >
                          {$$("components.learning.graphs.select.video.title")}
                        </Button>
                        <Button
                          variant={"brand"}
                          w={"100%"}
                          size={"sm"}
                          onClick={() => {
                            onAOpen();
                          }}
                        >
                          {$$(
                            "components.learning.graphs.select.article.title",
                          )}
                        </Button>
                      </ButtonGroup>
                      <Stack spacing={2}>
                        <Heading size={"sm"}>
                          {$$("components.articles")}
                        </Heading>
                        <HStack overflow={"auto"} spacing={2}>
                          {c.recommendedArticles.map((a) => {
                            return (
                              <Card
                                bg={"gray.800"}
                                rounded={"md"}
                                shadow={"xl"}
                                minW={"200px"}
                              >
                                <CardHeader>
                                  <Image
                                    src={a.featureImage}
                                    rounded={"md"}
                                    mb={2}
                                  />
                                  <p>
                                    <b>{$$("components.articles.source")}</b>:{" "}
                                    <i>{a.featureImageCPR}</i>
                                    <br />
                                    <b>{$$("pages.admin.articles.new.tags")}</b>
                                    : {a.tags.join(", ")}
                                  </p>
                                  <Heading size={"lg"}>{a.title}</Heading>
                                  <Button
                                    colorScheme={"red"}
                                    leftIcon={<FaTrash />}
                                    onClick={async () => {
                                      const recommendedVideos =
                                        c.recommendedVideos.map(
                                          (v) => (v as any)._id,
                                        ) || [];
                                      let recommendedArticles =
                                        c.recommendedArticles.map(
                                          (a) => (a as any)._id,
                                        ) || [];

                                      recommendedArticles =
                                        recommendedArticles.filter(
                                          (x) => x !== a._id,
                                        );

                                      const res =
                                        await REST.School.updateRecommendedContent(
                                          localStorage.getItem(
                                            "token",
                                          ) as string,
                                          id,
                                          recommendedVideos,
                                          recommendedArticles,
                                        );

                                      if (res.status !== 200) {
                                        await PopupManager.alertAsync({
                                          title: $$("control.error"),
                                          description: res.payload.error,
                                        });
                                        return;
                                      }

                                      await reloadClass();
                                    }}
                                  >
                                    {$$("general.remove")}
                                  </Button>
                                </CardHeader>
                              </Card>
                            );
                          })}
                        </HStack>

                        <Heading size={"sm"}>{$$("menu.videos")}</Heading>
                        <HStack overflow={"auto"} spacing={2}>
                          {c.recommendedVideos.map((v) => {
                            return (
                              <Card
                                bg={"gray.800"}
                                rounded={"md"}
                                shadow={"xl"}
                                minW={"200px"}
                              >
                                <CardHeader>
                                  <Heading size={"lg"}>{v.title}</Heading>
                                  <Button
                                    colorScheme={"red"}
                                    leftIcon={<FaTrash />}
                                    onClick={async () => {
                                      let recommendedVideos =
                                        c.recommendedVideos.map(
                                          (v) => (v as any)._id,
                                        ) || [];
                                      const recommendedArticles =
                                        c.recommendedArticles.map(
                                          (a) => (a as any)._id,
                                        ) || [];

                                      recommendedVideos =
                                        recommendedVideos.filter(
                                          (x) => x !== (v as any)._id,
                                        );

                                      const res =
                                        await REST.School.updateRecommendedContent(
                                          localStorage.getItem(
                                            "token",
                                          ) as string,
                                          id,
                                          recommendedVideos,
                                          recommendedArticles,
                                        );

                                      if (res.status !== 200) {
                                        await PopupManager.alertAsync({
                                          title: $$("control.error"),
                                          description: res.payload.error,
                                        });
                                        return;
                                      }

                                      await reloadClass();
                                    }}
                                  >
                                    {$$("general.remove")}
                                  </Button>
                                </CardHeader>
                              </Card>
                            );
                          })}
                        </HStack>
                      </Stack>
                    </Box>
                  </Stack>
                </TabPanel>
                <TabPanel p={0}>
                  <Flex mt={2} w={"100%"} justifyContent={"flex-end"}>
                    <IconButton
                      aria-label={"Create Students"}
                      icon={<FaPlus />}
                      variant={"brand"}
                      onClick={async () => {
                        const count = parseInt(
                          await PopupManager.promptAsync({
                            title: $$("pages.teachers.classes.students.create"),
                            helperText: $$(
                              "pages.teachers.classes.students.create.desc",
                            ),
                          }),
                        );

                        if (!count) return;

                        const res = await REST.School.createStudents(
                          localStorage.getItem("token") as string,
                          id,
                          count,
                        );

                        if (res.status !== 200) {
                          await PopupManager.alertAsync({
                            title: $$("control.error"),
                            description: res.payload.error,
                          });
                          return;
                        }

                        await reloadClass();
                      }}
                    />
                  </Flex>
                  <Grid
                    mt={3}
                    templateColumns={[
                      "repeat(1, 1fr)",
                      "repeat(2, 1fr)",
                      "repeat(3, 1fr)",
                    ]}
                    gap={3}
                  >
                    {c.students.map((student) => {
                      return (
                        <>
                          <Box
                            rounded={"md"}
                            bg={"gray.800"}
                            p={3}
                            shadow={"xl"}
                          >
                            <Text>{student.email}</Text>
                            <Text>
                              <b>
                                {$$(
                                  "pages.teachers.classes.students.login.code",
                                )}
                              </b>
                              :{" "}
                              {new Array(2).fill(0).map(() => {
                                return (
                                  <>
                                    {new Date(student.createdAt)
                                      .getUTCMilliseconds()
                                      .toString().length < 3
                                      ? new Date(student.createdAt)
                                          .getUTCMilliseconds()
                                          .toString()
                                          .padStart(3, "0")
                                      : new Date(student.createdAt)
                                          .getUTCMilliseconds()
                                          .toString()}
                                  </>
                                );
                              })}
                            </Text>
                            <Button
                              mt={2}
                              size={"sm"}
                              colorScheme={"red"}
                              w={"100%"}
                              onClick={async () => {
                                if (
                                  !(await PopupManager.confirmAsync({
                                    title: $$("control.delete"),
                                    question: $$(
                                      "pages.teachers.classes.students.delete",
                                    ),
                                  }))
                                )
                                  return;

                                const res = await REST.School.deleteStudent(
                                  localStorage.getItem("token") as string,
                                  id,
                                  student._id,
                                );

                                if (res.status !== 200) {
                                  await PopupManager.alertAsync({
                                    title: $$("control.error"),
                                    description: res.payload.error,
                                  });
                                  return;
                                }

                                await reloadClass();
                              }}
                            >
                              {$$("control.delete")}
                            </Button>
                          </Box>
                        </>
                      );
                    })}
                  </Grid>
                </TabPanel>
                <TabPanel p={0}>
                  <TeachersClassPermissions classId={c._id} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
      </MobileBox>
      <VideoSelector
        onClose={onVClose}
        isOpen={isVOpen}
        onSelection={onVSelection}
      />
      <ArticleSelector
        isOpen={isAOpen}
        onClose={onAClose}
        onSelection={onASelection}
      />
    </Page>
  );
}
