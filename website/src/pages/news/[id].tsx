/**
 * website/src/pages/news/[id].tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.11.2023
 *
 */

import * as React from "react";
import { Flex, Heading, Stack, Image } from "@chakra-ui/react";
import { getDirectusApi } from "@/directus";
import { useEffect } from "react";
import { readItem } from "@directus/sdk";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import * as remarkGfm from "remark-gfm";

export default function PostReader() {
  const { id: postId } = useParams();

  const directus = getDirectusApi();

  const [post, setPost] = React.useState<{
    id: string;
    user_created: string;
    date_created: string;
    feature_image: string;
    feature_image_author: string;
    title: string;
    markdown: string;
    tags: string;
  } | null>(null);

  useEffect(() => {
    directus.request(readItem("Posts", postId as string)).then((post) => {
      setPost(post as any);
    });
  }, [postId]);

  if (post == null) return <>Laden...</>;
  return (
    <>
      <Flex align="center" justify="center" w={"100%"} minH={[0, "100vh"]}>
        <Stack
          spacing={8}
          w="100%"
          maxW="800px"
          p={8}
          bgColor={["transparent", "#000"]}
          rounded="lg"
          shadow={["none", "xl"]}
        >
          <Flex
            justifyContent={"center"}
            direction={"column"}
            w={"100%"}
            alignItems={"center"}
          >
            <Image
              src={"https://content.saveworld.one/assets/" + post.feature_image}
              maxW={"75%"}
              rounded={"xl"}
            />
            <Heading size={"md"}>Foto: {post.feature_image_author}</Heading>
          </Flex>
          <ReactMarkdown
            remarkPlugins={
              // @ts-ignore
              [remarkGfm.default]
            }
          >
            {post.markdown.replace(
              /!\[(.*)\]\((.*)\)/g,
              "![$1](https://content.saveworld.one/assets/$2)",
            )}
          </ReactMarkdown>
        </Stack>
      </Flex>
    </>
  );
}
