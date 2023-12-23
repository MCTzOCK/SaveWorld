/**
 * mobile/src/pages/recipes/Cookbook.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import {
  Avatar,
  Box,
  Flex,
  Grid,
  Heading,
  Link,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useUserData } from "../../hooks/useUserData";
import { REST } from "@saveworld/api-js";
import { useEffect } from "react";
import MobileBox from "../../components/MobileBox";
import { ENDPOINT } from "../../env";

export default function Cookbook() {
  const [recipes, setRecipes] = React.useState<
    {
      _id: string;
      title: string;
      created_by: string;
      steps: string[];
      ingredients: string[];
      image: string;
    }[]
  >([]);
  const { userInfo, loggedIn } = useUserData();
  const [prefs, setPrefs] = React.useState<{
    cookbookItems: string[];
  }>({
    cookbookItems: [],
  });

  useEffect(() => {
    reloadPrefs();
  }, []);

  useEffect(() => {
    reloadRecipes();
  }, [prefs]);

  const reloadPrefs = async () => {
    const res = await REST.Account.preferences(
      localStorage.getItem("token") as string,
    );

    if (res.status === 200) {
      const px = res.payload.prefs;
      if (!px.cookbookItems) px.cookbookItems = [];
      setPrefs(px);
    }
  };

  const reloadRecipes = async () => {
    let rcp = [];
    for (const item of prefs.cookbookItems) {
      const res = await REST.Recipes.recipe(
        localStorage.getItem("token") as string,
        item,
      );
      if (res.status === 200) {
        rcp.push(res.payload.recipe);
      }
    }
    setRecipes(rcp);
  };

  return (
    <>
      <Page title={"Kochbuch"}>
        <MobileBox>
          In deinen Kochbuch befinden sich alle Rezepte, die du dir gemerkt
          hast. Aktuell sind es {prefs.cookbookItems.length} Rezepte.
          <Grid
            mt={4}
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap={4}
          >
            {recipes.map((r) => {
              return (
                <Box
                  bgColor={"gray.900"}
                  rounded={"md"}
                  shadow={"xl"}
                  p={4}
                  as={Link}
                  href={"/recipes/" + r._id}
                  backgroundImage={ENDPOINT + r.image}
                  backgroundPosition={"center"}
                  backgroundRepeat={"no-repeat"}
                  backgroundSize={"cover"}
                  minH={"200px"}
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
                      {r.title}
                    </Heading>
                    <Stack>
                      <VStack>
                        <Avatar
                          src={
                            ENDPOINT +
                            "/media/profile-picture-username/" +
                            r.created_by
                          }
                          size={"lg"}
                        />
                        <Text
                          backgroundColor={"rgba(0,0,0,0.5)"}
                          p={1}
                          rounded={"lg"}
                        >
                          @{r.created_by}
                        </Text>
                      </VStack>
                    </Stack>
                  </Flex>
                </Box>
              );
            })}
          </Grid>
        </MobileBox>
      </Page>
    </>
  );
}
