/**
 * mobile/src/pages/admin/AdminRecipeDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.12.2023
 *
 */

import * as React from "react";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../../util/PopupManager";
import { useEffect } from "react";
import { IonButton, IonSearchbar, useIonRouter } from "@ionic/react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ENDPOINT } from "../../env";
import Page from "../../components/Page";
import MobileBox from "../../components/MobileBox";
import { FaTrash } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { $$ } from "../../translations/i18n";

export default function AdminRecipeDashboard() {
  const router = useIonRouter();

  const [query, setQuery] = React.useState<string>("");
  const [recipes, setRecipes] = React.useState<
    {
      _id: string;
      title: string;
      created_by: string;
      steps: string[];
      ingredients: string[];
    }[]
  >([]);
  const [pages, setPages] = React.useState(0);
  const [page, setPage] = React.useState(0);

  const loadPage = async (p: number) => {
    const res = await REST.Recipes.recipes(
      localStorage.getItem("token") as string,
      p,
      query,
    );

    if (res.status === 200) {
      setRecipes(res.payload.entries);
      setPages(res.payload.pages);
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$("pages.admin.recipes.loading.error", res.payload.error),
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
      <Page title={$$("menu.recipes")} redGradient>
        <MobileBox bg={"#101010"}>
          <IonSearchbar
            placeholder={$$("control.search")}
            value={query}
            onIonInput={(e) => setQuery(e.detail.value as string)}
            style={{
              padding: 0,
            }}
          />
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
            ]}
            gap={4}
          >
            {recipes.map((r) => {
              return (
                <Box bgColor={"gray.900"} rounded={"md"} shadow={"xl"} p={4}>
                  <Flex
                    w={"100%"}
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={4}
                  >
                    <Heading fontSize={"xl"}>{r.title}</Heading>
                    <Stack>
                      <VStack>
                        <Avatar
                          src={
                            ENDPOINT +
                            "/media/profile-picture-username/" +
                            r.created_by
                          }
                        />
                        <Text>@{r.created_by}</Text>
                      </VStack>
                    </Stack>
                  </Flex>
                  <ButtonGroup w={"100%"} mt={4}>
                    <IconButton
                      aria-label={"Delete"}
                      icon={<FaTrash />}
                      variant={"ghost"}
                      colorScheme={"red"}
                      w={"100%"}
                      onClick={async () => {
                        if (
                          !(await PopupManager.confirmAsync({
                            title: $$("control.delete"),
                            question: $$("pages.admin.recipes.delete"),
                          }))
                        )
                          return;

                        const res = await REST.Recipes.delete(
                          localStorage.getItem("token") as string,
                          r._id,
                        );

                        if (res.status !== 200) {
                          await PopupManager.alertAsync({
                            title: $$("control.error"),
                            description: $$(
                              "pages.admin.recipes.delete.error",
                              res.payload.error,
                            ),
                          });
                        } else {
                          await PopupManager.alertAsync({
                            title: $$("control.success"),
                            description: $$(
                              "pages.admin.recipes.delete.success",
                            ),
                          });
                          setQuery("");
                          setPage(0);
                          loadPage(0);
                        }
                      }}
                    />
                    <IconButton
                      aria-label={"Edit"}
                      icon={<FaPen />}
                      variant={"ghost"}
                      colorScheme={"brand"}
                      w={"100%"}
                      onClick={() => {
                        const data: {
                          title: string;
                          ingredients: string[];
                          steps: string[];
                        } = {
                          title: r.title,
                          ingredients: r.ingredients,
                          steps: r.steps,
                        };

                        const b64 = btoa(JSON.stringify(data));

                        router.push(
                          "/recipes/create?saveworld.data.recipe.edit=" +
                            b64 +
                            "&saveworld.data.recipe.id=" +
                            r._id,
                        );
                      }}
                    />
                  </ButtonGroup>
                </Box>
              );
            })}
          </Grid>
        </MobileBox>
      </Page>
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
            {$$("control.back")}
          </IonButton>
        ) : null}
        {page < pages - 1 ? (
          <IonButton
            color={"success"}
            onClick={() => setPage(page + 1)}
            expand={"block"}
          >
            {$$("control.next")}
          </IonButton>
        ) : null}
      </div>
    </>
  );
}
