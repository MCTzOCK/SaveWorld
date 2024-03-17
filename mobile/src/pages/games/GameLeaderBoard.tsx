/**
 * mobile/src/pages/games/GameLeaderBoard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.02.2024
 *
 */

import * as React from "react";
import { useParams } from "react-router";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";
import { games } from "../../util/types/Games";
import { Avatar, Grid, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import MobileBox from "../../components/MobileBox";
import { useEffect } from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { REST, RESTEnv } from "@saveworld/api-js/index";

export default function GameLeaderBoard() {
  const { game } = useParams<{ game: string }>();
  const realGame = games.find((g) => g.identifier === game);
  const [leaderBoard, setLeaderBoard] = React.useState<
    {
      user: {
        username: string;
        _id: string;
      };
      score: number;
    }[]
  >([]);

  useRedirectForAnon();

  useEffect(() => {
    REST.Games.leaderboard(game).then((res) => {
      setLeaderBoard(res.payload.leaderboard as any[]);
    });
  }, [game]);

  if (!realGame) {
    return (
      <Page title={$$("pages.games.leaderboard.title")} isBeta>
        <h1>{$$("pages.games.leaderboard.notfound")}</h1>
      </Page>
    );
  }

  return (
    <Page title={$$("pages.games.leaderboard.title")} isBeta>
      <MobileBox>
        <Stack gap={2}>
          {Object.keys(leaderBoard).map((l, i) => {
            const l1 = leaderBoard[i];
            return (
              <HStack
                spacing={4}
                key={i}
                w={"100%"}
                flex={"100%"}
                bg={
                  i === 0
                    ? "gold"
                    : i === 1
                    ? "silver"
                    : i === 2
                    ? "#CD7F32"
                    : "gray.800"
                }
                p={4}
                rounded={"md"}
              >
                <Avatar
                  size={"md"}
                  name={l1.user.username}
                  src={
                    RESTEnv.API_URL +
                    "/media/profile-picture-username/" +
                    l1.user.username
                  }
                />
                <Heading w="100%" size={"md"}>
                  {l1.user.username}
                </Heading>
                <Heading size={"md"}>{l1.score}</Heading>
              </HStack>
            );
          })}
        </Stack>
      </MobileBox>
    </Page>
  );
}
