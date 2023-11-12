/**
 * website/src/components/rf/PictureNode.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import { Handle, Position } from "reactflow";
import { Box, Image, Text } from "@chakra-ui/react";

export default function PictureNode(props: {
  data: {
    imgUrl: string;
    text: string;
    handles: {
      type: "source" | "target";
      position: Position;
      id: string;
    }[];
  };
}) {
  return (
    <>
      {props.data.handles.map((handle) => {
        return (
          <Handle
            type={handle.type}
            position={handle.position}
            id={handle.id}
            key={handle.id}
          />
        );
      })}
      <Box backgroundColor={"gray.800"} rounded={"md"} p={2}>
        <Image src={props.data.imgUrl} w={128} />
        <Text textAlign={"center"} mt={2}>
          {props.data.text}
        </Text>
      </Box>
    </>
  );
}
