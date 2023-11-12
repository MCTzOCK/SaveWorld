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
  Heading,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import MobileBox from "./MobileBox";
import { IonSearchbar, useIonRouter } from "@ionic/react";

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
      <Page title={props.pageTitle ? props.pageTitle : "Artikel"}>
        <MobileBox>
          <IonSearchbar
            placeholder={"Suchen..."}
            onIonInput={(e) => {
              setQuery(e.detail.value || "");
            }}
          />

          <TableContainer>
            <Table>
              <Tbody>
                {posts.map((post) => {
                  return (
                    <>
                      <Tr
                        _hover={{
                          background: "var(--ion-card-background)",
                        }}
                        cursor={"pointer"}
                        onClick={() => {
                          router.push(
                            props.postBaseUrl + "/" + post.id,
                            "none",
                            "push",
                          );
                        }}
                      >
                        <Td maxW={"100px"}>
                          <Image
                            src={
                              DIRECTUS_ENDPOINT +
                              "/assets/" +
                              post.feature_image
                            }
                            maxW={"100px"}
                          />
                        </Td>
                        <Td w={"100%"} pl={"20%"}>
                          <Heading>{post.title}</Heading>
                        </Td>
                      </Tr>
                    </>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </MobileBox>
      </Page>
    </>
  );
}
