/**
 * mobile/src/components/RecipeModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.12.2023
 *
 */

import * as React from "react";
import SaveWorldModal from "./SaveWorldModal";
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
} from "@ionic/react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  ListItem,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  UnorderedList,
  useSteps,
} from "@chakra-ui/react";
import { FaBackward, FaForward } from "react-icons/fa";

export default function RecipeModal(props: {
  open: boolean;
  onClose: () => void;
  recipe: {
    _id: string;
    title: string;
    created_by: string;
    steps: string[];
    ingredients: string[];
  };
}) {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: props.recipe.steps.length,
  });
  return (
    <>
      <SaveWorldModal
        title={props.recipe.title}
        isOpen={props.open}
        onClose={props.onClose}
      >
        <IonAccordionGroup
          style={{
            borderRadius: "var(--chakra-radii-lg)",
            marginTop: "1.5rem",
          }}
        >
          <IonAccordion
            value={"ingredients"}
            style={{
              borderRadius: "var(--chakra-radii-lg)",
              backgroundColor: "black",
            }}
          >
            <IonItem slot="header" color="light">
              <IonLabel>Zutaten</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Für das Rezept werden folgende Zutaten benötigt:
              <UnorderedList>
                {props.recipe.ingredients.map((i) => {
                  return <ListItem>{i}</ListItem>;
                })}
              </UnorderedList>
            </div>
          </IonAccordion>
        </IonAccordionGroup>
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          w={"100%"}
          gap={6}
        >
          <Stepper
            index={activeStep}
            mt={6}
            orientation={"vertical"}
            height={"fit-content"}
            minHeight={"50vh"}
            gap={0}
          >
            {props.recipe.steps.map((s, i) => {
              return (
                <Step key={i}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink={0}>
                    <StepTitle></StepTitle>
                  </Box>
                  <StepSeparator />
                </Step>
              );
            })}
          </Stepper>
          <Box p={4} bgColor={"black"} rounded={"xl"} shadow={"xl"} w={"75%"}>
            <Text>{props.recipe.steps[activeStep]}</Text>
            <ButtonGroup
              w={"100%"}
              mt={4}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <IconButton
                aria-label={"Back"}
                color={"red.500"}
                icon={<FaBackward />}
                variant={"ghost"}
                isDisabled={activeStep == 0}
                onClick={() => {
                  setActiveStep(activeStep - 1);
                }}
              />
              <IconButton
                aria-label={"Back"}
                color={"brand.500"}
                icon={<FaForward />}
                variant={"ghost"}
                isDisabled={activeStep == props.recipe.steps.length - 1}
                onClick={() => {
                  setActiveStep(activeStep + 1);
                }}
              />
            </ButtonGroup>
          </Box>
        </Flex>
      </SaveWorldModal>
    </>
  );
}
