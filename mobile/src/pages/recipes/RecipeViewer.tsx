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
} from "@ionic/react";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";
import MobileBox from "../../components/MobileBox";
import {
  Accordion,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
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

export default function RecipeViewer() {
  const { userInfo, loggedIn } = useUserData();

  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = React.useState<{
    _id: string;
    title: string;
    created_by: string;
    steps: string[];
    ingredients: string[];
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    REST.Recipes.recipe(localStorage.getItem("token") as string, id).then(
      (res) => {
        if (res.status === 200) {
          setRecipe(res.payload.recipe);
        } else {
          PopupManager.alert({
            title: "Fehler",
            description:
              "Rezept konnte nicht geladen werden: " + res.payload.error,
            callback: () => {
              window.location.href = "/recipes";
            },
          });
        }
      },
    );
  }, [id]);

  if (!recipe) {
    return (
      <Page title={"Rezept laden"}>
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
                  } = {
                    title: recipe.title,
                    ingredients: recipe.ingredients,
                    steps: recipe.steps,
                  };

                  const b64 = btoa(JSON.stringify(data));

                  window.location.href =
                    "/recipes/create?saveworld.data.recipe.edit=" +
                    b64 +
                    "&saveworld.data.recipe.id=" +
                    recipe._id;
                }}
              >
                Bearb.
              </Button>
              <Button
                w={"100%"}
                color={"red.500"}
                onClick={async () => {
                  if (
                    !(await PopupManager.confirmAsync({
                      title: "Löschen?",
                      question: "Möchtest du dieses Rezept wirklich löschen?",
                    }))
                  )
                    return;

                  const res = await REST.Recipes.delete(
                    localStorage.getItem("token") as string,
                    recipe._id,
                  );

                  if (res.status !== 200) {
                    PopupManager.alert({
                      title: "Fehler",
                      description:
                        "Rezept konnte nicht gelöscht werden: " +
                        res.payload.error,
                    });
                    return;
                  } else {
                    PopupManager.alert({
                      title: "Erfolg",
                      description: "Rezept wurde erfolgreich gelöscht.",
                      callback: () => {
                        window.location.href = "/recipes";
                      },
                    });
                  }
                }}
              >
                Löschen
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
              Dieses Rezept wurde von <b>@{recipe.created_by}</b> erstellt.
            </Text>
            <IconButton
              aria-label={"Speichern"}
              icon={<FaShare />}
              variant={"ghost"}
              colorScheme={"brand"}
              onClick={async () => {
                await Share.share({
                  title: "Rezept für " + recipe.title,
                  text: "Schau dir dieses Rezept an!",
                  url: "https://app.saveworld.one/recipes/" + recipe._id,
                });
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
                <IonLabel>Zutaten</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Für das Rezept werden folgende Zutaten benötigt:
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
                <IonLabel>Schritte</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                Das Rezept wird wie folgt zubereitet:
                <OrderedList>
                  {recipe.steps.map((i) => {
                    return <ListItem>{i}</ListItem>;
                  })}
                </OrderedList>
              </div>
            </IonAccordion>
          </IonAccordionGroup>
          <Button color={"brand.500"} mt={5} w={"100%"} onClick={onOpen}>
            Rezept zubereiten
          </Button>
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

              window.location.href =
                "/recipes/create?saveworld.data.recipe.edit=" + b64;
            }}
          >
            Rezept bearbeiten
          </Button>
        </MobileBox>
        <RecipeModal open={isOpen} onClose={onClose} recipe={recipe} />
      </Page>
    </>
  );
}
