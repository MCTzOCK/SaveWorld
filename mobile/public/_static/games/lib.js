/**
 * mobile/public/games/lib.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.01.2024
 *
 */
const t = window.top;

window.receiveToken = () => {
  return t.localStorage.getItem("token");
};

window.unityInstance = {
  save: (game, key, value) => {
    if (key === "highscore") {
      window.REST.Games.updateLeaderboard(game, value, window.receiveToken());
    }
    t.localStorage.setItem(game + "_" + key, value);
  },
  load: async (game, key) => {
    if (key === "highscore") {
      //return await window.REST.Games;
      return 0;
    } else {
      return t.localStorage.getItem(game + "_" + key) || 0;
    }
  },
};
