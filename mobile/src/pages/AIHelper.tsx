/**
 * mobile/src/pages/AIHelper.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.01.2024
 *
 */

import * as React from "react";
import Page from "../components/Page";
import { $$ } from "../translations/i18n";
import MobileBox from "../components/MobileBox";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Link,
  ListItem,
  Select,
  Stack,
  Text,
  Textarea,
  UnorderedList,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { FaExclamation, FaLeaf } from "react-icons/fa6";
import { FaPen, FaProjectDiagram } from "react-icons/fa";
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { aiPrompt } from "../util/ai";
import PopupManager from "../util/PopupManager";

export default function AIHelper() {
  const [answerLength, setAnswerLength] = React.useState<
    "short" | "medium" | "long" | "longest"
  >("short");

  const presetPrompts: {
    displayName: string;
    process: () => void;
    icon: ReactElement;
  }[] = [
    {
      displayName: $$("pages.ai.prompts.eco.tipps"),
      icon: <FaLeaf />,
      process: () => {},
    },
    {
      displayName: $$("pages.ai.prompts.projects.ideas"),
      icon: <FaProjectDiagram />,
      process: () => {},
    },
    {
      displayName: $$("pages.ai.prompts.blog.template"),
      icon: <FaPen />,
      process: () => {},
    },
    {
      displayName: $$("pages.ai.prompts.sustainability.fact"),
      icon: <FaExclamation />,
      process: () => {},
    },
  ];

  const processPrompt = async (prompt: string) => {
    const response = await aiPrompt({
      prompt: prompt,
      maxTokens:
        answerLength === "short"
          ? 50
          : answerLength === "medium"
          ? 100
          : answerLength === "long"
          ? 150
          : 250,
    });

    PopupManager.alert({
      title: "Result",
      description: response,
    });
  };

  return (
    <>
      <Page title={$$("pages.ai.title")} isBeta>
        <MobileBox>
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            w={"100%"}
            mb={4}
          >
            <Badge
              fontSize={"md"}
              fontWeight={"700"}
              padding={2}
              borderRadius={10}
              background={
                "linear-gradient(159deg, rgba(74,252,70,1) 0%, rgba(63,94,251,1) 100%)"
              }
              color={"white"}
              as={Link}
              href={"https://ai.meta.com/llama/"}
              target={"_blank"}
            >
              {$$("pages.ai.powered.by")}
            </Badge>
          </Flex>
          <Text>{$$("pages.ai.text")}</Text>

          <IonAccordionGroup
            style={{
              borderRadius: "var(--chakra-radii-lg)",
              marginTop: "1.5rem",
            }}
          >
            <IonAccordion
              value={"settings"}
              style={{
                borderRadius: "var(--chakra-radii-lg)",
                background: "black",
              }}
            >
              <IonItem slot="header" color="light">
                <IonLabel>{$$("menu.settings")}</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                <FormControl>
                  <FormLabel>
                    {$$("pages.ai.settings.prompt.length.title")}
                  </FormLabel>
                  <Select
                    value={answerLength}
                    onChange={(e) => {
                      setAnswerLength(
                        e.target.value as
                          | "short"
                          | "medium"
                          | "long"
                          | "longest",
                      );
                    }}
                  >
                    <option value={"short"}>
                      {$$("pages.ai.settings.prompt.length.short")}
                    </option>
                    <option value={"medium"}>
                      {$$("pages.ai.settings.prompt.length.medium")}
                    </option>
                    <option value={"long"}>
                      {$$("pages.ai.settings.prompt.length.long")}
                    </option>
                    <option value={"longest"}>
                      {$$("pages.ai.settings.prompt.length.longest")}
                    </option>
                  </Select>
                </FormControl>
              </div>
            </IonAccordion>
          </IonAccordionGroup>
          <Grid templateColumns={"repeat(2, 1fr)"} gap={4} mt={4}>
            {presetPrompts.map((prompt) => {
              return (
                <>
                  <Stack
                    p={4}
                    rounded={"md"}
                    bg={
                      "linear-gradient(159deg, rgba(74,252,70,1) 0%, rgba(63,94,251,1) 100%)"
                    }
                    textAlign={"center"}
                    gap={4}
                    cursor={"pointer"}
                    onClick={prompt.process}
                  >
                    <Flex
                      w={"100%"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"2rem"}
                    >
                      {prompt.icon}
                    </Flex>
                    <Text fontWeight={700}>{prompt.displayName}</Text>
                  </Stack>
                </>
              );
            })}
          </Grid>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              const formData = new FormData(e.target as HTMLFormElement);

              const prompt = formData.get("prompt");

              if (!prompt) {
                return;
              }

              processPrompt(prompt as string);
            }}
          >
            <Textarea
              placeholder={$$("pages.ai.prompt.placeholder")}
              mt={4}
              name={"prompt"}
            />
            <Button
              mt={4}
              w={"100%"}
              type={"submit"}
              background={
                "linear-gradient(159deg, rgba(74,252,70,1) 0%, rgba(63,94,251,1) 100%)"
              }
              color={"white"}
              _hover={{
                background:
                  "linear-gradient(159deg, rgba(74,252,70,1) 0%, rgba(63,94,251,1) 100%)",
              }}
            >
              {$$("general.submit")}
            </Button>
          </form>
        </MobileBox>
      </Page>
    </>
  );
}
