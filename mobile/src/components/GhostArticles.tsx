/**
 * mobile/src/components/GhostArticles.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.11.2023
 *
 */

import * as React from "react";
import { PostOrPage } from "@tryghost/content-api";
import { useIonRouter } from "@ionic/react";
import { getGhostContentApi } from "../env";
import { useEffect } from "react";
import Page from "./Page";
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Heading,
  Image,
} from "@chakra-ui/react";

export default function GhostArticles(props: {
  pageTitle?: string;
  ghostFilter: string;
  postBaseUrl: string;
}) {
  const [posts, setPosts] = React.useState<PostOrPage[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [pages, setPages] = React.useState<number>(1);
  const router = useIonRouter();

  const ghostApi = getGhostContentApi();

  useEffect(() => {
    ghostApi.posts
      .browse({
        filter: props.ghostFilter,
        include: ["count.posts", "authors"],
        page: page,
        limit: 2,
      })
      .then((posts) => {
        setPosts(posts);
        setPage(posts.meta.pagination.page);
        setPages(posts.meta.pagination.pages);
      });
  }, [page]);

  return (
    <>
      <Page title={props.pageTitle ? props.pageTitle : "Artikel"}>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
          gap={4}
        >
          {posts.map((post) => {
            return (
              <>
                <Card
                  background={
                    "var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)))"
                  }
                >
                  <CardHeader>
                    {post.feature_image && <Image src={post.feature_image} />}
                    <Heading size={"lg"}>{post.title}</Heading>
                  </CardHeader>
                  <CardBody mt={-2} pt={0}>
                    {post.primary_author && (
                      <>
                        <Flex
                          w={"100%"}
                          gap={4}
                          flexDirection={"row"}
                          mb={4}
                          alignItems={"center"}
                        >
                          <Avatar
                            src={
                              post.primary_author.profile_image ||
                              "/blank-profile-picture-973460_1280.png"
                            }
                            size={"md"}
                          />
                          <Heading size={"md"}>
                            {post.primary_author.name}
                          </Heading>
                        </Flex>
                      </>
                    )}
                    {post.excerpt}
                    <ButtonGroup w={"100%"} mt={2}>
                      <Button
                        w={"100%"}
                        color={"saveworld_green.500"}
                        onClick={() => {
                          router.push(
                            `${props.postBaseUrl}/${post.id}`,
                            "none",
                            "push",
                          );
                        }}
                      >
                        Weiterlesen
                      </Button>
                    </ButtonGroup>
                  </CardBody>
                </Card>
              </>
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
            marginTop: "1rem",
          }}
        >
          <ButtonGroup w={"100%"}>
            {page > 1 ? (
              <Button
                color={"var(--ion-color-danger)"}
                onClick={() => setPage(page - 1)}
                w={"100%"}
              >
                Zurück
              </Button>
            ) : null}
            {page < pages ? (
              <Button
                color={"saveworld_green.500"}
                onClick={() => setPage(page + 1)}
                w={"100%"}
              >
                Weiter
              </Button>
            ) : null}
          </ButtonGroup>
        </div>
      </Page>
    </>
  );
}
