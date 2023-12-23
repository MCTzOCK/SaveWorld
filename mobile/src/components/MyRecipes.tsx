/**
 * mobile/src/components/MyRecipes.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.12.2023
 *
 */

import * as React from "react";
import { REST } from "@saveworld/api-js";
import PopupManager from "../util/PopupManager";
import { useEffect } from "react";
import { IonButton, IonSearchbar } from "@ionic/react";
import {
  Avatar,
  Box,
  Flex,
  Grid,
  Heading,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ENDPOINT } from "../env";

export default function MyRecipes() {
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
  const [pages, setPages] = React.useState(0);
  const [page, setPage] = React.useState(0);

  const loadPage = async (p: number) => {
    const res = await REST.Recipes.myRecipes(
      localStorage.getItem("token") as string,
      p,
      query,
    );

    if (res.status === 200) {
      setRecipes(res.payload.entries);
      setPages(res.payload.pages);
    } else {
      PopupManager.alert({
        title: "Fehler",
        description:
          "Rezepte konnten nicht geladen werden: " + res.payload.error,
      });
    }
  };

  useEffect(() => {
    setPage(0);
    loadPage(0);
  }, [query]);

  useEffect(() => {
    loadPage(page);
  }, [page]);

  return (
    <>
      <IonSearchbar
        placeholder={"Suchen"}
        value={query}
        onIonInput={(e) => setQuery(e.detail.value as string)}
        style={{
          padding: 0,
        }}
      />
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {page > 0 ? (
          <IonButton
            color={"danger"}
            onClick={() => setPage(page - 1)}
            expand={"block"}
          >
            Zurück
          </IonButton>
        ) : null}
        {page < pages - 1 ? (
          <IonButton
            color={"success"}
            onClick={() => setPage(page + 1)}
            expand={"block"}
          >
            Weiter
          </IonButton>
        ) : null}
      </div>
    </>
  );
}
