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
    console.log("Save", game, key, value);
    t.localStorage.setItem(game + "_" + key, value);
  },
  load: (game, key) => {
    console.log("Load", game, key);
    return t.localStorage.getItem(game + "_" + key);
  },
};
