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
import { REST } from "@saveworld/api-js/index";
import { useEffect } from "react";
import MobileBox from "../../components/MobileBox";
import { ENDPOINT } from "../../env";
import { IonSearchbar } from "@ionic/react";
import RecipeCard from "../../components/RecipeCard";
import { $$ } from "../../translations/i18n";

export default function Cookbook() {
  const [query, setQuery] = React.useState<string>("");
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
      <Page title={$$("pages.recipes.cookbook")}>
        <MobileBox>
          {$$("pages.recipes.cookbook.description", recipes.length.toString())}
          <IonSearchbar
            value={query}
            onIonInput={(e) => setQuery(e.detail.value!)}
            style={{
              padding: 0,
            }}
          />
          <Grid
            mt={2}
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap={4}
          >
            {recipes
              .filter((r) =>
                r.title.toLowerCase().includes(query.toLowerCase()),
              )
              .map((r) => {
                return <RecipeCard recipe={r} />;
              })}
          </Grid>
        </MobileBox>
      </Page>
    </>
  );
}
