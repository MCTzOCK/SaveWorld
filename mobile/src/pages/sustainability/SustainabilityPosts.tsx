/**
 * mobile/src/pages/sustainability/SustainabilityPosts.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.11.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useEffect } from "react";
import { getGhostContentApi } from "../../env";
import { PostOrPage } from "@tryghost/content-api";
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
import { IonButton, IonSearchbar, useIonRouter } from "@ionic/react";

export default function SustainabilityPosts() {
  const [posts, setPosts] = React.useState<PostOrPage[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [pages, setPages] = React.useState<number>(1);
  const router = useIonRouter();

  const ghostApi = getGhostContentApi();

  useEffect(() => {
    ghostApi.posts
      .browse({
        filter: "tag:sustainability",
        include: "count.posts",
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
      <Page title={"Artikel"}>
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
                  <CardBody>
                    {post.excerpt}
                    <ButtonGroup w={"100%"} mt={2}>
                      <Button
                        w={"100%"}
                        color={"saveworld_green.500"}
                        onClick={() => {
                          router.push(
                            `/sustainability/articles/${post.id}`,
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
