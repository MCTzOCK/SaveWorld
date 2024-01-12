/**
 * mobile/src/components/RecipeCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.12.2023
 *
 */

import * as React from "react";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ENDPOINT } from "../env";
import { useIonRouter } from "@ionic/react";

export default function RecipeCard(props: {
  recipe: {
    _id: string;
    title: string;
    created_by: string;
    steps: string[];
    ingredients: string[];
    image: string;
  } | null;
  customOnClick?: () => void;
}) {
  const router = useIonRouter();
  if (!props.recipe) {
    return <></>;
  }
  return (
    <>
      <Box
        bgColor={"gray.900"}
        rounded={"md"}
        shadow={"xl"}
        p={4}
        as={Link}
        href={props.customOnClick ? undefined : "/recipes/" + props.recipe._id}
        backgroundImage={ENDPOINT + props.recipe.image}
        backgroundPosition={"center"}
        backgroundRepeat={"no-repeat"}
        backgroundSize={"cover"}
        minH={"200px"}
        onClick={
          props.customOnClick
            ? props.customOnClick
            : (e) => {
                e.preventDefault();
                router.push("/recipes/" + props.recipe!._id);
              }
        }
      >
        <Flex
          w={"100%"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={4}
          h={"100%"}
        >
          <Heading
            fontSize={"xl"}
            backgroundColor={"rgba(0,0,0,0.5)"}
            p={2}
            rounded={"lg"}
          >
            {props.recipe.title}
          </Heading>
          <Stack>
            <VStack>
              <Avatar
                src={
                  ENDPOINT +
                  "/media/profile-picture-username/" +
                  props.recipe.created_by
                }
                size={"lg"}
              />
              <Text backgroundColor={"rgba(0,0,0,0.5)"} p={1} rounded={"lg"}>
                @{props.recipe.created_by}
              </Text>
            </VStack>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}
