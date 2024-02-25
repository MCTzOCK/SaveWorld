/**
 * mobile/src/pages/admin/AdminArticleDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.02.2024
 *
 */

import * as React from "react";
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
  Image,
  Input,
  Stack,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import SaveWorldModal from "../../components/SaveWorldModal";
import { useEffect, useState } from "react";
import { uploadFiles } from "@directus/sdk";
import { uploadImage } from "../../util/files";
import { ENDPOINT } from "../../env";
import { FaImage } from "react-icons/fa";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";
import { IonButton } from "@ionic/react";

export default function AdminArticleDashboard() {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [currentArticle, setCurrentArticle] = useState<{
    _id?: string;
    title: string;
    featureImage: string;
    featureImageAuthor: string;
    content: string;
    tags: string[];
  } | null>({
    title: "",
    featureImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAZCAYAAADe3PCBAAAAUUlEQVR42u3UQQEAAAQEMJKLflJ42UKsK5kCXmoBgAAAAQACAAQACAAQACAAQACAAAABAAIABAAIABAAIABAAIAAAAEAAgAEAAgAEAAgAODMAnX1Pk/7BPEvAAAAAElFTkSuQmCC",
    featureImageAuthor: "",
    content: "",
    tags: [],
  });

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
  const [action, setAction] = useState<"create" | "edit">("create");

  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(1);

  const reload = async () => {
    loadPage(page);
  };

  const loadPage = async (p: number) => {
    const res = await REST.Content.articles(p);
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
    <>
      <Page title={$$("components.articles")} redGradient>
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
            {$$("pages.admin.articles.new")}
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
          {articles.map((a) => {
            return (
              <Card
                backgroundColor={
                  "var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)))"
                }
              >
                <CardHeader>
                  <Image src={a.featureImage} rounded={"md"} mb={2} />
                  <p>
                    <b>{$$("components.articles.source")}</b>:{" "}
                    <i>{a.featureImageCPR}</i>
                  </p>
                  <Heading size={"lg"}>{a.title}</Heading>
                </CardHeader>
                <CardBody>
                  <ButtonGroup w={"100%"} mt={4}>
                    <Button
                      color={"brand.500"}
                      w={"100%"}
                      onClick={() => {
                        setCurrentArticle({
                          title: a.title,
                          featureImage: a.featureImage,
                          featureImageAuthor: a.featureImageCPR,
                          content: a.content,
                          tags: a.tags,
                          _id: a._id,
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
                            title: $$("control.confirm"),
                            question: $$("pages.admin.articles.delete.confirm"),
                          }))
                        )
                          return;

                        const res = await REST.Admin.deleteArticle(
                          localStorage.getItem("token") as string,
                          a._id,
                        );

                        if (res.status !== 200) {
                          await PopupManager.alertAsync({
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
            ? $$("pages.admin.articles.new")
            : $$("general.edit")
        }
        isOpen={isOpen}
        onClose={onClose}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (action === "create") {
              const res = await REST.Admin.createArticle(
                localStorage.getItem("token") as string,
                currentArticle?.title || "",
                currentArticle?.content || "",
                currentArticle?.tags || [],
                currentArticle?.featureImage || "",
                currentArticle?.featureImageAuthor || "",
              );

              if (res.status !== 200) {
                await PopupManager.alertAsync({
                  title: $$("control.error"),
                  description: res.payload.error,
                });
                return;
              }

              onClose();
              setCurrentArticle({
                title: "",
                featureImage:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAZCAYAAADe3PCBAAAAUUlEQVR42u3UQQEAAAQEMJKLflJ42UKsK5kCXmoBgAAAAQACAAQACAAQACAAQACAAAABAAIABAAIABAAIABAAIAAAAEAAgAEAAgAEAAgAODMAnX1Pk/7BPEvAAAAAElFTkSuQmCC",
                featureImageAuthor: "",
                content: "",
                tags: [],
              });

              reload();
            } else {
              const res = await REST.Admin.updateArticle(
                localStorage.getItem("token") as string,
                currentArticle?._id || "",
                currentArticle?.title || "",
                currentArticle?.content || "",
                currentArticle?.tags || [],
                currentArticle?.featureImage || "",
                currentArticle?.featureImageAuthor || "",
              );

              if (res.status !== 200) {
                await PopupManager.alertAsync({
                  title: $$("control.error"),
                  description: res.payload.error,
                });
                return;
              }

              onClose();
              setCurrentArticle({
                title: "",
                featureImage:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAZCAYAAADe3PCBAAAAUUlEQVR42u3UQQEAAAQEMJKLflJ42UKsK5kCXmoBgAAAAQACAAQACAAQACAAQACAAAABAAIABAAIABAAIABAAIAAAAEAAgAEAAgAEAAgAODMAnX1Pk/7BPEvAAAAAElFTkSuQmCC",
                featureImageAuthor: "",
                content: "",
                tags: [],
              });

              reload();
            }
          }}
        >
          <Stack spacing={4} mb={2}>
            <Image
              src={
                currentArticle
                  ? currentArticle.featureImage
                  : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAZCAYAAADe3PCBAAAAUUlEQVR42u3UQQEAAAQEMJKLflJ42UKsK5kCXmoBgAAAAQACAAQACAAQACAAQACAAAABAAIABAAIABAAIABAAIAAAAEAAgAEAAgAEAAgAODMAnX1Pk/7BPEvAAAAAElFTkSuQmCC"
              }
              rounded={"md"}
              cursor={"pointer"}
              onClick={async () => {
                uploadImage((url) => {
                  setCurrentArticle({
                    ...currentArticle,
                    featureImage: ENDPOINT + url,
                    title: currentArticle?.title || "",
                    featureImageAuthor:
                      currentArticle?.featureImageAuthor || "",
                    content: currentArticle?.content || "",
                    tags: currentArticle?.tags || [],
                  });
                });
              }}
            />
            <FormControl isRequired>
              <FormLabel>{$$("pages.admin.video.form.title")}</FormLabel>
              <Input
                type={"text"}
                placeholder={$$("pages.admin.video.form.title")}
                value={currentArticle?.title}
                onChange={(e) => {
                  setCurrentArticle({
                    ...currentArticle,
                    title: e.target.value,
                    featureImage: currentArticle?.featureImage || "",
                    featureImageAuthor:
                      currentArticle?.featureImageAuthor || "",
                    content: currentArticle?.content || "",
                    tags: currentArticle?.tags || [],
                  });
                }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>
                {$$("pages.admin.articles.new.feature.image.author")}
              </FormLabel>
              <Input
                type={"text"}
                placeholder={$$(
                  "pages.admin.articles.new.feature.image.author",
                )}
                value={currentArticle?.featureImageAuthor}
                onChange={(e) => {
                  setCurrentArticle({
                    ...currentArticle,
                    title: currentArticle?.title || "",
                    featureImage: currentArticle?.featureImage || "",
                    featureImageAuthor: e.target.value,
                    content: currentArticle?.content || "",
                    tags: currentArticle?.tags || [],
                  });
                }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{$$("pages.admin.articles.new.tags")}</FormLabel>
              <Input
                type={"text"}
                placeholder={
                  $$("pages.admin.articles.new.tags") +
                  " (news, sustainability)"
                }
                value={currentArticle?.tags[0] || ""}
                onChange={(e) => {
                  setCurrentArticle({
                    ...currentArticle,
                    title: currentArticle?.title || "",
                    featureImage: currentArticle?.featureImage || "",
                    featureImageAuthor:
                      currentArticle?.featureImageAuthor || "",
                    content: currentArticle?.content || "",
                    tags: [e.target.value],
                  });
                }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{$$("pages.admin.articles.new.content")}</FormLabel>
              <Textarea
                placeholder={$$("pages.admin.articles.new.content")}
                value={currentArticle?.content}
                onChange={(e) => {
                  setCurrentArticle({
                    ...currentArticle,
                    title: currentArticle?.title || "",
                    featureImage: currentArticle?.featureImage || "",
                    featureImageAuthor:
                      currentArticle?.featureImageAuthor || "",
                    content: e.target.value,
                    tags: currentArticle?.tags || [],
                  });
                }}
              />
              <Button
                mt={2}
                leftIcon={<FaImage />}
                variant={"brand"}
                onClick={async () => {
                  uploadImage((url) => {
                    setCurrentArticle({
                      ...currentArticle,
                      featureImage: currentArticle?.featureImage || "",
                      title: currentArticle?.title || "",
                      featureImageAuthor:
                        currentArticle?.featureImageAuthor || "",
                      content:
                        (currentArticle?.content || "") +
                        `![Image](${ENDPOINT + url})`,
                      tags: currentArticle?.tags || [],
                    });
                  });
                }}
              >
                {$$("components.chat.message.add.image")}
              </Button>
            </FormControl>
            <Button type={"submit"} variant={"brand"}>
              {action === "create"
                ? $$("pages.admin.articles.new")
                : $$("general.edit")}
            </Button>
          </Stack>
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
