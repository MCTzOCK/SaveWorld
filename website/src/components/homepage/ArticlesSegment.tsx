/**
 * website/src/components/homepage/ArticlesSegment.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import { getDirectusApi } from "@/directus";
import { useEffect, useState } from "react";
import { readItems } from "@directus/sdk";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Heading,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";

export default function ArticlesSegment() {
  const directus = getDirectusApi();

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
              _contains: "sustainability",
            },
          },
          limit: 3,
        }),
      )
      .then((data) => {
        setPosts(data);
      });
  }, []);

  return (
    <>
      <Box minH={"fit-content"} w={"100%"} p={5}>
        <Heading
          color={"primary.500"}
          fontWeight={900}
          fontSize={"6xl"}
          textAlign={"center"}
        >
          Neuste Artikel
        </Heading>
        <Flex
          mt={4}
          gap={4}
          justifyContent={"center"}
          direction={["column", "row"]}
        >
          {posts.map((post) => {
            return (
              <>
                <Card
                  bg={"#111111"}
                  as={Link}
                  href={"/download"}
                  maxW={"400px"}
                >
                  <CardHeader>
                    <Image
                      src={
                        "https://content.saveworld.one/assets/" +
                        post.feature_image
                      }
                      rounded={"lg"}
                    />
                    <Heading color={"primary.500"} mt={4}>
                      {post.title}
                    </Heading>
                  </CardHeader>
                </Card>
              </>
            );
          })}
        </Flex>
      </Box>
    </>
  );
}
