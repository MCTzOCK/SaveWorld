/**
 * mobile/src/pages/recipes/CreateRecipe.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import MobileBox from "../../components/MobileBox";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Stack,
  Stepper,
  Tag,
  TagCloseButton,
  TagLabel,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPen } from "react-icons/fa";
import { FaPlus, FaTrash } from "react-icons/fa6";
import * as async_hooks from "async_hooks";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";
import { useParams } from "react-router";
import { useEffect } from "react";
import RecipeModal from "../../components/RecipeModal";
import { uploadImage } from "../../util/files";
import { ENDPOINT } from "../../env";

export default function CreateRecipe() {
  const [title, setTitle] = React.useState<string>("");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [steps, setSteps] = React.useState<string[]>([]);
  const [image, setImage] = React.useState<string>("");
  const [recipeIdToUpdate, setRecipeIdToUpdate] = React.useState<string | null>(
    null,
  );

  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);

    if (usp.get("saveworld.data.recipe.edit")) {
      const data = JSON.parse(
        atob(usp.get("saveworld.data.recipe.edit") as string),
      );
      setTitle(data.title);
      setIngredients(data.ingredients);
      setSteps(data.steps);
      setImage(data.image);

      if (usp.get("saveworld.data.recipe.id")) {
        setRecipeIdToUpdate(usp.get("saveworld.data.recipe.id") as string);
      }
    }
  }, []);

  return (
    <>
      <Page title={recipeIdToUpdate ? "Rezept bearbeiten" : "Neues Rezept"}>
        <MobileBox padding={"4"}>
          <Stack gap={8}>
            <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
              <Box
                backgroundImage={ENDPOINT + image}
                w={"300px"}
                h={"200px"}
                backgroundPosition={"center"}
                backgroundRepeat={"no-repeat"}
                backgroundSize={"cover"}
                rounded={"xl"}
                shadow={"xl"}
              />
            </Flex>
            <Button
              color={"brand.500"}
              w={"100%"}
              onClick={async () => {
                uploadImage((url) => {
                  setImage(url);
                });
              }}
            >
              Bild bearbeiten
            </Button>
            <FormControl>
              <FormLabel>Titel</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  <FaPen />
                </InputLeftAddon>
                <Input
                  placeholder={"Titel"}
                  onChange={(ev) => {
                    setTitle(ev.target.value);
                  }}
                  value={title}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Zutaten</FormLabel>
              <Grid templateColumns={"repeat(2, 1fr)"} gap={4} mt={2} mb={2}>
                {ingredients.map((i) => {
                  return (
                    <Tag>
                      <TagLabel>{i}</TagLabel>
                      <TagCloseButton
                        onClick={() => {
                          setIngredients(
                            ingredients.filter((ing) => ing !== i),
                          );
                        }}
                      />
                    </Tag>
                  );
                })}
              </Grid>
              <InputGroup>
                <Input placeholder={"Zutate hinzufügen"} id={"ing"} />
                <InputRightElement>
                  <IconButton
                    aria-label={"Add Ingredient"}
                    icon={<FaPlus />}
                    onClick={() => {
                      const ing = document.getElementById(
                        "ing",
                      ) as HTMLInputElement;
                      if (ing.value !== "") {
                        setIngredients([...ingredients, ing.value]);
                        ing.value = "";
                      }
                    }}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Schritte</FormLabel>
              <Button
                color={"brand.500"}
                onClick={() => {
                  setSteps([...steps, ""]);
                }}
                w={"100%"}
              >
                Schritt hinzufügen
              </Button>
            </FormControl>
            {steps.map((st, i) => {
              return (
                <FormControl>
                  <InputGroup>
                    <InputLeftAddon>{i + 1}</InputLeftAddon>
                    <Input
                      placeholder={"Schritt"}
                      onChange={(ev) => {
                        const newSteps = steps;
                        newSteps[i] = ev.target.value;
                        setSteps([...newSteps]);
                      }}
                      value={st}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={"Delete Step"}
                        icon={<FaTrash />}
                        onClick={() => {
                          setSteps(steps.filter((s, j) => j !== i));
                        }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              );
            })}
            <Button
              color={"brand.500"}
              w={"100%"}
              onClick={async () => {
                if (!title || !ingredients || !steps) return;

                if (!recipeIdToUpdate) {
                  const res = await REST.Recipes.create(
                    localStorage.getItem("token") as string,
                    title,
                    steps,
                    ingredients,
                    image,
                  );

                  if (res.status === 200) {
                    await PopupManager.alertAsync({
                      title: "Rezept erstellt",
                      description: "Das Rezept wurde erfolgreich erstellt.",
                    });
                    window.location.href = "/recipes";
                  } else {
                    await PopupManager.alertAsync({
                      title: "Fehler",
                      description:
                        "Das Rezept konnte nicht erstellt werden: " +
                        res.payload.error,
                    });
                  }
                } else {
                  const res = await REST.Recipes.update(
                    localStorage.getItem("token") as string,
                    recipeIdToUpdate,
                    title,
                    steps,
                    ingredients,
                    image,
                  );

                  if (res.status === 200) {
                    await PopupManager.alertAsync({
                      title: "Rezept bearbeitet",
                      description: "Das Rezept wurde erfolgreich bearbeitet.",
                    });
                    window.location.href = "/recipes";
                  } else {
                    await PopupManager.alertAsync({
                      title: "Fehler",
                      description:
                        "Das Rezept konnte nicht gespeichert werden: " +
                        res.payload.error,
                    });
                  }
                }
              }}
            >
              Rezept {recipeIdToUpdate ? "bearbeiten" : "erstellen"}
            </Button>
          </Stack>
        </MobileBox>
      </Page>
    </>
  );
}
