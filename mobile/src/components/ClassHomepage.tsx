/**
 * mobile/src/components/ClassHomepage.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.03.2024
 *
 */

import * as React from "react";
import { useState } from "react";
import { MVideo } from "../types";
import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { REST } from "@saveworld/api-js/REST";
import { $$ } from "../translations/i18n";
import { FaTrash } from "react-icons/fa6";
import PopupManager from "../util/PopupManager";
import { useIonRouter } from "@ionic/react";

export default function ClassHomepage() {
  const [c, setC] = useState<{
    _id: string;
    name: string;
    students: string;
    createdBy: string;
    permissions: {
      permission: string;
      allowed: boolean;
    }[];
    __v: number;
    recommendedVideos: (MVideo & { _id: string })[];
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

  React.useEffect(() => {
    REST.School.myClass(localStorage.getItem("token") as string).then((res) => {
      if (res.status === 200) setC(res.payload.sClass);
    });
  }, []);

  const router = useIonRouter();

  if (!c)
    return (
      <Flex
        w={"100%"}
        h={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner size={"xl"} color={"brand.500"} />
      </Flex>
    );

  return (
    <>
      <Alert status={"success"} variant={"subtle"}>
        {$$("pages.class.homepage.disclaimer")}
      </Alert>
      <Box p={4}>
        <Heading size={"lg"} mt={-2}>
          {$$("pages.teachers.recommended.content")}
        </Heading>
        <Stack spacing={2}>
          <Heading size={"md"}>{$$("components.articles")}</Heading>
          <HStack overflow={"auto"} spacing={2}>
            {c.recommendedArticles.map((a) => {
              return (
                <Card
                  bg={"gray.800"}
                  rounded={"md"}
                  shadow={"xl"}
                  minW={"200px"}
                  maxW={"200px"}
                  onClick={() => {
                    router.push("/articles/" + a._id, "forward", "push");
                  }}
                  cursor={"pointer"}
                >
                  <CardHeader>
                    <Image src={a.featureImage} rounded={"md"} mb={2} />
                    <p>
                      <b>{$$("components.articles.source")}</b>:{" "}
                      <i>{a.featureImageCPR}</i>
                      <br />
                      <b>{$$("pages.admin.articles.new.tags")}</b>:{" "}
                      {a.tags.join(", ")}
                    </p>
                    <Heading size={"lg"}>{a.title}</Heading>
                  </CardHeader>
                </Card>
              );
            })}
          </HStack>

          <Heading size={"md"}>{$$("menu.videos")}</Heading>
          <HStack overflow={"auto"} spacing={2}>
            {c.recommendedVideos.map((v) => {
              return (
                <Card
                  bg={"gray.800"}
                  rounded={"md"}
                  shadow={"xl"}
                  minW={"200px"}
                  maxW={"200px"}
                  onClick={() => {
                    router.push("/learn?vid=" + v._id, "forward", "push");
                  }}
                  cursor={"pointer"}
                >
                  <CardHeader>
                    <Heading size={"lg"}>{v.title}</Heading>
                  </CardHeader>
                </Card>
              );
            })}
          </HStack>
        </Stack>
      </Box>
    </>
  );
}
