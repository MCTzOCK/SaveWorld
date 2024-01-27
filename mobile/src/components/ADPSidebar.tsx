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
import {
  Box,
  Button,
  Divider,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useIonRouter } from "@ionic/react";
import { MdHttp, MdQueryBuilder, MdQueryStats } from "react-icons/md";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";

export default function ADPSidebar() {
  const [models, setModels] = React.useState<string[]>([]);
  useEffect(() => {
    reloadModels();
  }, []);

  const reloadModels = async () => {
    const res = await REST.Admin.adpModels(
      localStorage.getItem("token") as string,
    );

    if (res.status !== 200) {
      return;
    }

    setModels(res.payload.models);
  };

  return (
    <>
      <Stack
        w={"100%"}
        h={"fit-content"}
        bg={"#121212"}
        flex={"10%"}
        minH={"100vh"}
        gap={4}
        p={2}
      >
        <CustomButton
          text={"Power Query"}
          icon={<MdQueryStats />}
          link={"/admin/adp/pq"}
        />
        <Divider />
        <Text>Dashboards</Text>
        {models.map((model) => {
          return (
            <CustomButton
              text={model}
              icon={<MdQueryBuilder />}
              link={"/admin/adp/model/" + model}
            />
          );
        })}
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
        textAlign={"left"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        leftIcon={props.icon}
      >
        {props.text}
      </Button>
    </>
  );
};
