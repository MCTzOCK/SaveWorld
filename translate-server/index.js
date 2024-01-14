/**
 * translate-server/index.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.01.2024
 *
 */

const express = require("express");
const app = express();

app.use(express.json());

const translate = require("@iamtraction/google-translate");

app.all("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }

    const { text, to } = req.body;
    if (!text || !to) {
      res.status(400).end();
      return;
    }

    translate(text, { to: to })
      .then((result) => {
        res.json(result);
      })
      .catch((e) => {
        res.status(500).end();
      });
  } catch (e) {
    res.status(500).end();
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
