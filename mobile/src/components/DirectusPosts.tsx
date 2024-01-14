/**
 * mobile/src/components/DirectusPosts.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.11.2023
 *
 */

import * as React from "react";
import { DIRECTUS_ENDPOINT, getDirectusApi } from "../env";
import { useEffect, useState } from "react";
import { readItems } from "@directus/sdk";
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import MobileBox from "./MobileBox";
import { IonSearchbar, useIonRouter } from "@ionic/react";
import { $$ } from "../translations/i18n";

export default function DirectusPosts(props: {
  pageTitle?: string;
  tagFilter: string;
  postBaseUrl: string;
}) {
  const router = useIonRouter();

  const directus = getDirectusApi();

  const [query, setQuery] = useState<string>("");

  const [posts, setPosts] = useState<
    {
      id: string;
      user_created: string;
      date_created: string;
      feature_image: string;
      feature_image_author: string;
      title: string;
      markdown: string;
      tags: string;
    }[]
  >([]);

  useEffect(() => {
    directus
      .request(
        readItems("Posts", {
          filter: {
            tags: {
              _contains: props.tagFilter,
            },
          },
          search: query,
        }),
      )
      .then((data) => {
        setPosts(data);
      });
  }, [query]);

  return (
    <>
      <Page
        title={props.pageTitle ? props.pageTitle : $$("components.articles")}
      >
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
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)",
          ]}
          gap={4}
        >
          {posts.map((post) => {
            return (
              <>
                <Card
                  backgroundColor={
                    "var(--ion-card-background, var(--ion-item-background, var(--ion-background-color, #fff)))"
                  }
                >
                  <CardHeader>
                    <Image
                      src={DIRECTUS_ENDPOINT + "/assets/" + post.feature_image}
                      rounded={"md"}
                      mb={2}
                    />
                    <p>
                      <b>{$$("components.articles.source")}</b>:{" "}
                      <i>{post.feature_image_author}</i>
                    </p>
                    <Heading size={"lg"}>{post.title}</Heading>
                  </CardHeader>
                  <CardBody>
                    <ButtonGroup w={"100%"} mt={4}>
                      <Button
                        color={"brand.500"}
                        w={"100%"}
                        onClick={() => {
                          router.push(
                            props.postBaseUrl + "/" + post.id,
                            "none",
                            "push",
                          );
                        }}
                      >
                        {$$("components.articles.read.more")}
                      </Button>
                    </ButtonGroup>
                  </CardBody>
                </Card>
              </>
            );
          })}
        </Grid>
      </Page>
    </>
  );
}
