/**
 * mobile/src/components/reactflow/ArticleNode.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.03.2024
 *
 */
import { useCallback } from "react";
import { Handle, Position } from "reactflow";

import * as React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { $$ } from "../../translations/i18n";
import { useIonRouter } from "@ionic/react";
import { showQuiz } from "../../util/quizzes";

export default function ArticleNode(props: { data: any }) {
  const router = useIonRouter();

  return (
    <>
      <Box
        style={{
          background: "var(--ion-color-light)",
        }}
        rounded={"md"}
        p={2}
        maxW={"300px"}
      >
        <Stack gap={4}>
          <Badge colorScheme="red" variant="solid">
            {$$("components.learning.graphs.nodes.article")}
          </Badge>
          <Image
            src={props.data.featureImage}
            w={"100%"}
            rounded={"md"}
            shadow={"xl"}
            maxW={"300px"}
          />
          <Heading size={"md"}>{props.data.title}</Heading>
          <Text fontSize={"sm"}>{props.data.description}</Text>
          <Button
            w={"100%"}
            variant={"brand"}
            onClick={async () => {
              router.push("/articles/" + props.data._id);
            }}
          >
            {$$("components.articles.read.more")}
          </Button>
        </Stack>
      </Box>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} id={"a"} />
    </>
  );
}
