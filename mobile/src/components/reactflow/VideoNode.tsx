/**
 * mobile/src/components/reactflow/VideoNode.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.02.2024
 *
 */
import { useCallback } from "react";
import { Handle, Position } from "reactflow";

import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { $$ } from "../../translations/i18n";
import { useIonRouter } from "@ionic/react";

export default function VideoNode(props: { data: any }) {
  const router = useIonRouter();

  return (
    <>
      <Box
        style={{
          background: "var(--ion-color-light)",
        }}
        rounded={"md"}
        p={2}
      >
        <Stack gap={4}>
          <Heading size={"md"}>{props.data.title}</Heading>
          <Text fontSize={"sm"}>{props.data.description}</Text>
          <Button
            w={"100%"}
            variant={"brand"}
            onClick={() => {
              router.push("/learn?vid=" + props.data._id);
            }}
          >
            {$$("components.learn.watch")}
          </Button>
        </Stack>
      </Box>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} id={"a"} />
    </>
  );
}
