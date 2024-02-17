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
window.REST = t.REST;

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
  load: (game, key) => {
    window.REST.Games.myScore(game, window.receiveToken()).then((res) => {
      t.localStorage.setItem(game + "_" + key, value);
    });
    return t.localStorage.getItem(game + "_" + key) || 0;
  },
};
