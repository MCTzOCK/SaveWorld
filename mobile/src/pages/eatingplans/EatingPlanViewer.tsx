/**
 * mobile/src/pages/eatingplans/EatingPlanViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useEffect, useState } from "react";
import { IonSpinner, useIonRouter } from "@ionic/react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { REST } from "@saveworld/api-js";
import { useParams } from "react-router";
import PopupManager from "../../util/PopupManager";
import {
  Button,
  ButtonGroup,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import MobileBox from "../../components/MobileBox";
import { useUserData } from "../../hooks/useUserData";
import RecipeCard from "../../components/RecipeCard";
import { FaHandPaper } from "react-icons/fa";
import { FaFileLines, FaPlus } from "react-icons/fa6";
import { Share } from "@capacitor/share";

export default function EatingPlanViewer() {
  useRedirectForAnon();
  const router = useIonRouter();

  const { date } = useParams<{ date: string }>();

  const [plan, setPlan] = useState<MEatingPlan | null>(null);

  useEffect(() => {
    reload();
  }, [date]);

  const reload = async () => {
    if (!date) return;
    const res = await REST.EatingPlans.eatingPlan(
      localStorage.getItem("token") as string,
      date,
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Der Essensplan konnte nicht geladen werden: " + res.payload.error,
      });
      return;
    }

    setPlan(res.payload.plan);
    reloadPrefs();
  };

  const [recipes, setRecipes] = React.useState<MRecipe[]>([]);
  const { userInfo, loggedIn } = useUserData();
  const [prefs, setPrefs] = React.useState<{
    cookbookItems: string[];
  }>({
    cookbookItems: [],
  });

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
      <Page
        title={plan ? new Date(plan.date).toLocaleDateString() : "Laden..."}
      >
        <MobileBox>
          {!plan ? (
            <>
              <IonSpinner />
            </>
          ) : (
            <>
              <Text>
                Du hast am {new Date(plan.date).toLocaleDateString()}{" "}
                {plan.recipes.length} Rezepte auf deinem Plan.
              </Text>
              <Button
                leftIcon={<FaPlus />}
                color={"brand.500"}
                mt={4}
                w={"100%"}
                onClick={async () => {
                  await PopupManager.alertAsync({
                    title: "Rezept hinzufügen",
                    description: (
                      <>
                        <Stack>
                          {recipes
                            .filter((r) => {
                              return !plan.recipes
                                .map((rx) => rx._id)
                                .includes(r._id);
                            })
                            .map((recipe) => {
                              return (
                                <RecipeCard
                                  recipe={recipe}
                                  customOnClick={async () => {
                                    PopupManager.removeCurrentPopup();
                                    const res = await REST.EatingPlans.update(
                                      localStorage.getItem("token") as string,
                                      date,
                                      [...plan.recipes, recipe._id],
                                    );

                                    if (res.status !== 200) {
                                      await PopupManager.alertAsync({
                                        title: "Fehler",
                                        description:
                                          "Der Essensplan konnte nicht aktualisiert werden: " +
                                          res.payload.error,
                                      });
                                      return;
                                    }

                                    reload();
                                    await PopupManager.alertAsync({
                                      title: "Erfolg",
                                      description:
                                        "Der Essensplan wurde aktualisiert.",
                                    });
                                  }}
                                />
                              );
                            })}
                        </Stack>
                      </>
                    ),
                  });
                }}
              >
                Rezept hinzufügen
              </Button>
              <Button
                w={"100%"}
                mt={4}
                color={"brand.500"}
                leftIcon={<FaFileLines />}
                isDisabled={plan.recipes.length === 0}
                onClick={async () => {
                  const ingredients: string[] = [];

                  for (const r of plan?.recipes) {
                    for (const i of r.ingredients) {
                      ingredients.push(i);
                    }
                  }

                  await PopupManager.alertAsync({
                    title: "Einkaufzettel",
                    description: (
                      <>
                        <UnorderedList>
                          {ingredients.map((i) => {
                            return <ListItem>{i}</ListItem>;
                          })}
                        </UnorderedList>
                        <Button
                          w={"100%"}
                          mt={4}
                          color={"brand.500"}
                          onClick={async () => {
                            let text = `Einkaufszettel für den ${new Date(
                              plan.date,
                            ).toLocaleDateString()}:\n\n`;

                            for (const i of ingredients) {
                              text += "• " + i + "\n";
                            }

                            Share.share({
                              title: "Einkaufszettel",
                              text: text,
                            });
                          }}
                        >
                          Exportieren
                        </Button>
                      </>
                    ),
                  });
                }}
              >
                Einkaufzettel erstellen
              </Button>
              <Stack mt={4} gap={4}>
                {plan.recipes.map((recipe) => {
                  return (
                    <RecipeCard
                      recipe={recipe}
                      customOnClick={async () => {
                        await PopupManager.alertAsync({
                          title: "Aktion wählen",
                          description: (
                            <>
                              <ButtonGroup w={"100%"}>
                                <Button
                                  color={"brand.500"}
                                  w={"100%"}
                                  onClick={() => {
                                    PopupManager.removeCurrentPopup();
                                    router.push("/recipes/" + recipe._id);
                                  }}
                                >
                                  Zubereiten
                                </Button>
                                <Button
                                  color={"brand.500"}
                                  w={"100%"}
                                  onClick={async () => {
                                    if (
                                      !(await PopupManager.confirmAsync({
                                        title: "Rezept entfernen",
                                        question:
                                          "Möchtest du das Rezept wirklich entfernen?",
                                      }))
                                    )
                                      return;

                                    const res = await REST.EatingPlans.update(
                                      localStorage.getItem("token") as string,
                                      date,
                                      plan.recipes.filter(
                                        (r) => r._id !== recipe._id,
                                      ),
                                    );

                                    if (res.status !== 200) {
                                      await PopupManager.alertAsync({
                                        title: "Fehler",
                                        description:
                                          "Der Essensplan konnte nicht aktualisiert werden: " +
                                          res.payload.error,
                                      });
                                      return;
                                    }

                                    reload();
                                  }}
                                >
                                  Entfernen
                                </Button>
                              </ButtonGroup>
                            </>
                          ),
                        });
                      }}
                    />
                  );
                })}
              </Stack>
            </>
          )}
        </MobileBox>
      </Page>
    </>
  );
}
