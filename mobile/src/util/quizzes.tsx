/**
 * mobile/src/util/quizzes.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.02.2024
 *
 */
import PopupManager from "./PopupManager";
import { Box, Button, Image, Stack, Text } from "@chakra-ui/react";
import { $$ } from "../translations/i18n";

export async function showQuiz(quiz: {
  title: string;
  createdAt: string;
  answers: string[];
  correctAnswer: number;
  featureImage: string;
}) {
  await PopupManager.alertAsync({
    title: quiz.title,
    description: (
      <>
        <Stack gap={4}>
          <Image
            src={quiz.featureImage}
            alt={quiz.title}
            rounded={"md"}
            w={"100%"}
          />
          {quiz.answers.map((answer, index) => (
            <Box
              key={index}
              rounded={"md"}
              bg={"brand.600"}
              p={2}
              fontWeight={"700"}
              cursor={"pointer"}
              onClick={() => {
                if (index === quiz.correctAnswer) {
                  PopupManager.alert({
                    title: $$("pages.quizzes.result"),
                    description: $$(
                      "pages.quizzes.result.description",
                      $$("general.correct"),
                      "",
                    ),
                  });
                } else {
                  PopupManager.alert({
                    title: $$("pages.quizzes.result"),
                    description: $$(
                      "pages.quizzes.result.description",
                      $$("general.wrong"),
                      $$(
                        "pages.quizzes.result.2",
                        quiz.answers[quiz.correctAnswer],
                      ),
                    ),
                  });
                }
              }}
            >
              <Text wordBreak={"break-all"}>{answer}</Text>
            </Box>
          ))}
        </Stack>
      </>
    ),
  });
}
