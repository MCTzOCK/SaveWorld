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
  useDisclosure,
} from "@chakra-ui/react";
import { ReactElement, useEffect, useState } from "react";
import { FaExclamation, FaLeaf } from "react-icons/fa6";
import { FaPen, FaProjectDiagram } from "react-icons/fa";
import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  useIonRouter,
} from "@ionic/react";
import { aiPrompt, promptV2, promptV2Chat } from "../util/ai";
import PopupManager from "../util/PopupManager";
import { REST } from "@saveworld/api-js/index";
import { MUserPreferences } from "../types";
import moment from "moment";
import AIChatModal from "../components/AIChatModal";

export default function AIHelper() {
  const [prefs, setPrefs] = useState<MUserPreferences | null>(null);
  const [lifestyleTemplates, setLifestyleTemplates] = useState<string[]>([]);
  const [lifestyleActions, setLifestyleActions] = useState<
    {
      name: string;
      current: number;
    }[]
  >([]);

  useEffect(() => {
    reloadPrefs();
    reloadLifestyle();
  }, []);

  const reloadLifestyle = async () => {
    const res = await REST.Lifestyle.templates();

    if (res.status !== 200) {
      PopupManager.alertAsync({
        title: $$("control.error"),
        description: res.payload.error,
      });
      return;
    }

    setLifestyleTemplates(res.payload.lst);

    const lifestyle = await REST.Lifestyle.my(
      localStorage.getItem("token") as string,
    );

    if (lifestyle.status !== 200) {
      await PopupManager.alertAsync({
        title: $$("control.error"),
        description: lifestyle.payload.error,
      });
      return;
    }

    const lx = lifestyle.payload.lifestyle;

    const lifestyleData = lx.actions.map((action: any) => {
      const template = res.payload.lst.find(
        (t: any) => t._id === action.template,
      );

      return {
        name: template.name,
        current: action.currentPerWeek,
      };
    });

    setLifestyleActions(lifestyleData);

    console.log(lifestyleData);
  };

  const reloadPrefs = async () => {
    const res = await REST.Account.preferences(
      localStorage.getItem("token") as string,
    );

    if (res.status !== 200) {
      PopupManager.alertAsync({
        title: $$("control.error"),
        description: res.payload.error,
      });
      return;
    }

    setPrefs(res.payload.prefs);
  };

  const presetPrompts: {
    displayName: string;
    process: () => void;
    icon: ReactElement;
  }[] = [
    {
      displayName: $$("pages.ai.prompts.eco.tipps"),
      icon: <FaLeaf />,
      process: () => {
        processPrompt(
          "Ich will mein Leben nachhaltiger gestalten. Aktuell sieht es so aus:\n" +
            lifestyleActions
              .map((action) => {
                return `${action.name}: ${action.current}x pro Woche`;
              })
              .join("\n"),
        );
      },
    },
    {
      displayName: $$("pages.ai.prompts.projects.ideas"),
      icon: <FaProjectDiagram />,
      process: async () => {
        const topic = await PopupManager.promptAsync({
          title: $$("pages.ai.prompts.blog.topic"),
          helperText: $$("pages.ai.prompts.blog.topic.description"),
        });

        if (!topic) {
          setLoading(false);
          return;
        }

        processPrompt(
          "Nenne mir eine Idee für ein lokales nachhaltiges und leicht umsetzbares Projekt, das auf Zusammenarbeit basiert mit dem Schwerpunkt '" +
            topic +
            "' (kein Gemeinschaftsgarten).",
        );
      },
    },
    {
      displayName: $$("pages.ai.prompts.blog.template"),
      icon: <FaPen />,
      process: async () => {
        const topic = await PopupManager.promptAsync({
          title: $$("pages.ai.prompts.blog.topic"),
          helperText: $$("pages.ai.prompts.blog.topic.description"),
        });

        if (!topic) {
          console.log(1);
          setLoading(false);
          return;
        }

        processPrompt(
          "Schreibe einen Blogpost über Nachhaltigkeit mit dem Schwerpunkt '" +
            topic +
            "'.",
        );
      },
    },
    {
      displayName: $$("pages.ai.prompts.sustainability.fact"),
      icon: <FaExclamation />,
      process: () => {
        processPrompt("Nenne mir einen zufälligen Fakt über Nachhaltigkeit.");
      },
    },
  ];

  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messages, setMessages] = useState<
    {
      role: string;
      content: string;
    }[]
  >([]);

  const onMessageSend = async (message: string) => {
    const output = await promptV2Chat(message, messages);

    setMessages(
      output.filter((m) => m.role === "assistant" || m.role === "user"),
    );
  };

  const processPrompt = async (prompt: string) => {
    if (prompt.length < 1) {
      setLoading(false);
      return;
    }

    const output = await promptV2(prompt);

    if (output === "") return;

    setLoading(false);

    await PopupManager.alertAsync({
      title: $$("pages.ai.title"),
      description: (
        <>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {output}
          </pre>
          <Button
            colorScheme={"brand"}
            onClick={() => {
              setMessages([
                {
                  role: "user",
                  content: prompt,
                },
                {
                  role: "assistant",
                  content: output,
                },
              ]);
              onOpen();
            }}
            mt={4}
          >
            {$$("pages.ai.open.in.chat")}
          </Button>
        </>
      ),
    });

    await reloadPrefs();
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
            >
              {$$("pages.ai.powered.by")}
            </Badge>
          </Flex>
          <Text>{$$("pages.ai.text")}</Text>
          <Grid templateColumns={"repeat(2, 1fr)"} gap={4} mt={4}>
            {presetPrompts.map((prompt) => {
              return (
                <>
                  <Stack
                    p={4}
                    rounded={"md"}
                    bg={loading ? "gray.600" : "brand.600"}
                    textAlign={"center"}
                    gap={4}
                    cursor={"pointer"}
                    onClick={async () => {
                      if (loading) return;
                      setLoading(true);
                      prompt.process();
                    }}
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

              setLoading(true);

              const formData = new FormData(e.target as HTMLFormElement);

              const prompt = formData.get("prompt");

              if (!prompt) {
                setLoading(false);
                return;
              }

              processPrompt(prompt as string);
            }}
          >
            <FormControl isRequired>
              <Textarea
                placeholder={$$("pages.ai.prompt.placeholder")}
                mt={4}
                name={"prompt"}
              />
            </FormControl>
            <Button
              mt={4}
              w={"100%"}
              type={"submit"}
              isLoading={loading}
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

          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            w={"100%"}
            mt={4}
            direction={"column"}
          >
            <Text>
              {$$(
                "pages.ai.left.contingent",
                String(prefs?.ai_left_usage || 0),
              )}
            </Text>
            <Text>{$$("pages.ai.left.contingent.refill")}</Text>
          </Flex>
        </MobileBox>
      </Page>
      <AIChatModal
        onClose={onClose}
        isOpen={isOpen}
        messages={messages}
        onSend={onMessageSend}
      />
    </>
  );
}
