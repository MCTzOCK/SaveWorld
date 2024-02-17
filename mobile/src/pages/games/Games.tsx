/**
 * mobile/src/pages/games/Games.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 16.02.2024
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";
import { IonSearchbar, useIonRouter } from "@ionic/react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Grid,
  IconButton,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { FaGamepad, FaTrophy } from "react-icons/fa6";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { games } from "../../util/types/Games";

export default function Games() {
  useRedirectForAnon();
  const [query, setQuery] = React.useState<string>("");

  const router = useIonRouter();

  return (
    <>
      <Page title={$$("pages.games.title")} isBeta>
        <IonSearchbar
          placeholder={$$("control.search")}
          value={query}
          onIonInput={(e) => {
            setQuery(e.detail.value!!);
          }}
          style={{ padding: 0 }}
        />
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(2, 1fr)",
            "repeat(3, 1fr)",
          ]}
        >
          {games
            .filter((game) => {
              return game.name.toLowerCase().includes(query.toLowerCase());
            })
            .map((game) => {
              return (
                <>
                  <Card key={game.identifier} bg={"gray.900"}>
                    <Image src={game.image} roundedTop={"md"} />
                    <CardHeader>
                      <Text fontWeight={"bold"} fontSize={"xl"}>
                        {$$(game.name as any)}
                      </Text>
                    </CardHeader>
                    <CardBody>
                      <Text fontSize={"lg"}>{$$(game.description as any)}</Text>
                      <ButtonGroup mt={4} w={"100%"}>
                        <Button
                          w={"100%"}
                          flex={"100%"}
                          colorScheme={"brand"}
                          leftIcon={<FaGamepad />}
                          onClick={() => {
                            router.push("/games/" + game.identifier);
                          }}
                        >
                          {$$("pages.games.play")}
                        </Button>
                        {game.hasLeaderboard && (
                          <IconButton
                            aria-label={"Leaderboard"}
                            icon={<FaTrophy />}
                            color={"brand.500"}
                            onClick={() => {
                              router.push(
                                "/games/" + game.identifier + "/leaderboard",
                              );
                            }}
                          />
                        )}
                      </ButtonGroup>
                    </CardBody>
                  </Card>
                </>
              );
            })}
        </Grid>
      </Page>
    </>
  );
}
