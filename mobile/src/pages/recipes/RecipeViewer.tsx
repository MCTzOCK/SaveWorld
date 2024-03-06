/**
 * mobile/src/pages/recipes/RecipeViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useParams } from "react-router";
import {
  IonAccordion,
  IonAccordionGroup,
  IonIcon,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  useIonRouter,
} from "@ionic/react";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../../util/PopupManager";
import MobileBox from "../../components/MobileBox";
import {
  Accordion,
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Image,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { informationCircle } from "ionicons/icons";
import { FaBookmark, FaShareNodes } from "react-icons/fa6";
import { FaShare, FaShareAlt, FaShareSquare } from "react-icons/fa";
import { Share } from "@capacitor/share";
import RecipeModal from "../../components/RecipeModal";
import { useUserData } from "../../hooks/useUserData";
import { ENDPOINT } from "../../env";
import { BiBookmark, BiSolidBookmark } from "react-icons/bi";
import { $$ } from "../../translations/i18n";

export default function RecipeViewer() {
  const router = useIonRouter();
  const { userInfo, loggedIn } = useUserData();
  const [prefs, setPrefs] = React.useState<{
    cookbookItems: string[];
  }>({
    cookbookItems: [],
  });

  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = React.useState<{
    _id: string;
    title: string;
    created_by: string;
    steps: string[];
    ingredients: string[];
    image: string;
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    reloadPrefs();
    REST.Recipes.recipe(localStorage.getItem("token") as string, id).then(
      (res) => {
        if (res.status === 200) {
          setRecipe(res.payload.recipe);
        } else {
          PopupManager.alert({
            title: $$("control.error"),
            description: $$("pages.recipes.loading.error", res.payload.error),
            callback: () => {
              router.push("/recipes");
            },
          });
        }
      },
    );
  }, [id]);

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

  if (!recipe) {
    return (
      <Page title={$$("general.loading")}>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "50vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IonSpinner />
        </div>
      </Page>
    );
  }

  return (
    <>
      <Page title={recipe.title}>
        <MobileBox padding={"4"}>
          <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
            <Box
              backgroundImage={ENDPOINT + recipe.image}
              mb={4}
              w={"300px"}
              h={"200px"}
              backgroundPosition={"center"}
              backgroundRepeat={"no-repeat"}
              backgroundSize={"cover"}
              rounded={"xl"}
              shadow={"xl"}
            />
          </Flex>
          {loggedIn && userInfo.username === recipe.created_by ? (
            <ButtonGroup mb={4} w={"100%"}>
              <Button
                w={"100%"}
                color={"brand.500"}
                onClick={() => {
                  const data: {
                    title: string;
                    ingredients: string[];
                    steps: string[];
                    image: string;
                  } = {
                    title: recipe.title,
                    ingredients: recipe.ingredients,
                    steps: recipe.steps,
                    image: recipe.image,
                  };

                  const b64 = btoa(JSON.stringify(data));

                  router.push(
                    "/recipes/create?saveworld.data.recipe.edit=" +
                      b64 +
                      "&saveworld.data.recipe.id=" +
                      recipe._id,
                  );
                }}
              >
                {$$("general.edit.short")}
              </Button>
              <Button
                w={"100%"}
                color={"red.500"}
                onClick={async () => {
                  if (
                    !(await PopupManager.confirmAsync({
                      title: $$("control.delete"),
                      question: $$("pages.recipes.delete.confirm"),
                    }))
                  )
                    return;

                  const res = await REST.Recipes.delete(
                    localStorage.getItem("token") as string,
                    recipe._id,
                  );

                  if (res.status !== 200) {
                    PopupManager.alert({
                      title: $$("control.error"),
                      description: $$(
                        "pages.recipes.delete.error",
                        res.payload.error,
                      ),
                    });
                    return;
                  } else {
                    PopupManager.alert({
                      title: $$("control.success"),
                      description: $$("pages.recipes.delete.success"),
                      callback: () => {
                        router.push("/recipes");
                      },
                    });
                  }
                }}
              >
                {$$("control.delete")}
              </Button>
            </ButtonGroup>
          ) : null}
          <Flex
            w={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
            direction={"row"}
            gap={4}
          >
            <Text>
              {$$("pages.recipes.created.by.1")} <b>@{recipe.created_by}</b>{" "}
              {$$("pages.recipes.created.by.2")}
            </Text>
            <IconButton
              aria-label={"Speichern"}
              icon={<FaShare />}
              variant={"ghost"}
              colorScheme={"brand"}
              onClick={async () => {
                await Share.share({
                  title: $$("pages.recipes.for") + recipe.title,
                  text: $$("pages.recipes.share.text"),
                  url: "https://app.saveworld.one/recipes/" + recipe._id,
                });
              }}
            />
            <IconButton
              aria-label={$$("control.save")}
              variant={"ghost"}
              icon={
                prefs.cookbookItems.includes(id) ? (
                  <BiSolidBookmark />
                ) : (
                  <BiBookmark />
                )
              }
              color={"yellow.500"}
              onClick={async () => {
                let newCookbookItems = [...prefs.cookbookItems];

                if (newCookbookItems.includes(recipe._id)) {
                  newCookbookItems = newCookbookItems.filter(
                    (i) => i !== recipe._id,
                  );
                } else {
                  newCookbookItems.push(recipe._id);
                }

                const res = await REST.Account.updatePreferences(
                  localStorage.getItem("token") as string,
                  {
                    cookbookItems: newCookbookItems,
                  },
                );

                if (res.status === 200) {
                  await reloadPrefs();
                } else {
                  PopupManager.alert({
                    title: $$("control.error"),
                    description: $$(
                      "pages.recipes.settings.update.error",
                      res.payload.error,
                    ),
                  });
                }
              }}
            />
          </Flex>
          <IonAccordionGroup
            style={{
              borderRadius: "var(--chakra-radii-lg)",
              marginTop: "1.5rem",
            }}
          >
            <IonAccordion
              value={"ingredients"}
              style={{
                borderRadius:
                  "var(--chakra-radii-lg) var(--chakra-radii-lg) 0 0",
              }}
            >
              <IonItem slot="header" color="light">
                <IonLabel>{$$("pages.recipes.ingredients")}</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                {$$("pages.recipes.ingredients.used")}
                <UnorderedList>
                  {recipe.ingredients.map((i) => {
                    return <ListItem>{i}</ListItem>;
                  })}
                </UnorderedList>
              </div>
            </IonAccordion>
            <IonAccordion
              value={"steps"}
              style={{
                borderRadius:
                  "0 0 var(--chakra-radii-lg) var(--chakra-radii-lg)",
              }}
            >
              <IonItem slot="header" color="light">
                <IonLabel>{$$("pages.recipes.steps")}</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                {$$("pages.recipes.steps.description")}
                <OrderedList>
                  {recipe.steps.map((i) => {
                    return <ListItem>{i}</ListItem>;
                  })}
                </OrderedList>
              </div>
            </IonAccordion>
          </IonAccordionGroup>
          <Button color={"brand.500"} mt={5} w={"100%"} onClick={onOpen}>
            {$$("pages.recipes.cook")}
          </Button>
          {loggedIn && userInfo.username !== recipe.created_by ? (
            <Button
              color={"brand.500"}
              mt={5}
              w={"100%"}
              onClick={() => {
                const data: {
                  title: string;
                  ingredients: string[];
                  steps: string[];
                } = {
                  title: recipe.title,
                  ingredients: recipe.ingredients,
                  steps: recipe.steps,
                };

                const b64 = btoa(JSON.stringify(data));

                router.push(
                  "/recipes/create?saveworld.data.recipe.edit=" + b64,
                );
              }}
            >
              {$$("pages.recipes.edit")}
            </Button>
          ) : null}
        </MobileBox>
        <RecipeModal open={isOpen} onClose={onClose} recipe={recipe} />
      </Page>
    </>
  );
}
