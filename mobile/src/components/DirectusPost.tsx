/**
 * mobile/src/components/DirectusPost.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.11.2023
 *
 */

import * as React from "react";
import { DIRECTUS_ENDPOINT, getDirectusApi } from "../env";
import Page from "./Page";
import { useEffect } from "react";
import { readItem } from "@directus/sdk";
import MobileBox from "./MobileBox";
import Markdown from "@uiw/react-md-editor/lib/components/TextArea/Markdown";
import { Flex, Heading, Image } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { $$ } from "../translations/i18n";
import { translateOnline } from "../util/online-translate";

export default function DirectusPost(props: { postId: string }) {
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
    directus.request(readItem("Posts", props.postId)).then(async (post) => {
      let content = post.markdown;
      let title = post.title;

      if (window.language !== "de") {
        content = await translateOnline(content, window.language);
        title = await translateOnline(title, window.language);
      }

      setPost({
        ...post,
        markdown: content,
        title: title,
      });
    });
  }, [props.postId]);

  if (post == null)
    return <Page title={$$("general.loading")}>{$$("general.loading")}</Page>;

  return (
    <>
      <Page title={post.title}>
        <MobileBox padding={"4"}>
          <Flex
            justifyContent={"center"}
            direction={"column"}
            w={"100%"}
            alignItems={"center"}
          >
            <Image
              src={DIRECTUS_ENDPOINT + "/assets/" + post.feature_image}
              maxW={"75%"}
              rounded={"xl"}
            />
            <Heading size={"md"}>
              {$$("general.image")}: {post.feature_image_author}
            </Heading>
          </Flex>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.markdown.replace(
              /!\[(.*)\]\((.*)\)/g,
              "![$1](" + DIRECTUS_ENDPOINT + "/assets/$2)",
            )}
          </ReactMarkdown>
        </MobileBox>
      </Page>
    </>
  );
}
