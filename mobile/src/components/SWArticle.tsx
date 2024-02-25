/**
 * mobile/src/components/SWArticle.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.02.2024
 *
 */

import * as React from "react";
import { useParams } from "react-router";
import { REST } from "@saveworld/api-js";
import PopupManager from "../util/PopupManager";
import { translateOnlineV3 } from "../util/online-translate";
import Page from "./Page";
import { Flex, Heading, Image, Spinner } from "@chakra-ui/react";
import { $$ } from "../translations/i18n";
import MobileBox from "./MobileBox";
import { DIRECTUS_ENDPOINT } from "../env";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function SWArticle() {
  const { id } = useParams<{ id: string }>();

  const [article, setArticle] = React.useState<{
    _id: string;
    title: string;
    content: string;
    featureImage: string;
    featureImageCPR: string;
    createdAt: string;
    tags: string[];
  }>();

  React.useEffect(() => {
    REST.Content.article(id).then(async (res) => {
      if (res.status !== 200) {
        await PopupManager.alertAsync({
          title: "Error",
          description: res.payload.error,
        });
        return;
      }

      const article = res.payload.article;

      if (window.language !== "de") {
        article.content = await translateOnlineV3({
          from: "de",
          to: window.language,
          text: article.content,
        });
        article.title = await translateOnlineV3({
          from: "de",
          to: window.language,
          text: article.title,
        });
      }

      setArticle(article);
    });
  }, [id]);

  if (!article)
    return (
      <Page title={$$("general.loading")}>
        <Flex
          w={"100%"}
          h={"100vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Spinner size={"xl"} color={"brand.500"} />
        </Flex>
      </Page>
    );

  return (
    <>
      <Page title={article.title}>
        <MobileBox padding={"4"}>
          <Flex
            justifyContent={"center"}
            direction={"column"}
            w={"100%"}
            alignItems={"center"}
          >
            <Image src={article.featureImage} maxW={"75%"} rounded={"xl"} />
            <Heading size={"md"}>
              {$$("general.image")}: {article.featureImageCPR}
            </Heading>
          </Flex>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </MobileBox>
      </Page>
    </>
  );
}
