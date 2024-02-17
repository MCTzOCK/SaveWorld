/**
 * mobile/src/util/types/Games.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 17.02.2024
 *
 */
import { german } from "../../translations/de";

export const games: {
  name: string;
  description: keyof typeof german;
  hasLeaderboard: boolean;
  image: string;
  identifier: string;
}[] = [
  {
    name: "pages.games.game.ecosurfers.name",
    description: "pages.games.game.ecosurfers.description",
    hasLeaderboard: true,
    image: "/_static/game-splashes/surfers.png",
    identifier: "surfers",
  },
];
