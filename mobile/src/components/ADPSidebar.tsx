/**
 * mobile/src/components/ADPSidebar.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.01.2024
 *
 */

import * as React from "react";
import { Box, Button, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { useIonRouter } from "@ionic/react";
import { MdHttp, MdQueryBuilder, MdQueryStats } from "react-icons/md";

export default function ADPSidebar() {
  return (
    <>
      <Stack
        w={"100%"}
        h={"fit-content"}
        bg={"gray.900"}
        flex={"10%"}
        minH={"100vh"}
        gap={4}
        p={2}
      >
        <Text fontSize={"lg"} textAlign={"center"}>
          API
        </Text>
        <CustomButton
          text={"Explore"}
          icon={<MdHttp />}
          link={"/admin/adp/api/explore"}
        />
        <CustomButton
          text={"Power Query"}
          icon={<MdQueryStats />}
          link={"/admin/adp/pq?model=APIRequestModel&title=API Power Query"}
        />
      </Stack>
    </>
  );
}

const CustomButton = (props: { text: string; icon: any; link: string }) => {
  const router = useIonRouter();
  return (
    <>
      <Button
        w={"100%"}
        as={Link}
        variant={"ghost"}
        href={props.link}
        onClick={() => {
          router.push(props.link);
        }}
        leftIcon={props.icon}
      >
        {props.text}
      </Button>
    </>
  );
};
