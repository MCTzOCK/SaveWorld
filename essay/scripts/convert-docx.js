/**
 * essay/scripts/convert-docx.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 20.12.2023
 *
 */

require("dotenv").config();

const path = require("path");
const fs = require("fs");
const ppt = require("puppeteer");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.PPT_EXEC_PATH,
  });

  const page = await browser.newPage();

  await page.goto(process.env.PDF_CONV_URL);

  await page.setViewport({ width: 1080, height: 1920 });

  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
  );

  await page.waitForTimeout(2000);

  const consentButton = await page.$("button.fc-cta-consent");

  if (consentButton) {
    console.log(consentButton);
    await consentButton.click();
  }

  await page.waitForSelector("input[type=file]");

  const inputUploadHandle = await page.$("input[type=file]");
  let fileToUpload = path.join(
    __dirname,
    "../pdf/Schriftliche Arbeit - SaveWorld.pdf",
  );

  await inputUploadHandle.uploadFile(fileToUpload);
  const client = await page.target().createCDPSession();

  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: path.join(__dirname, "../pdf"),
  });

  await page.waitForTimeout(5000);
  //fc-cta-consent
  const [button] = await page.$x(
    "//button[./span[contains(., 'DOWNLOAD')]]",
    //"//span[contains(., 'DOWNLOAD')]/parent::button",
  );
  if (button) {
    console.log(button);
    await button.click();
  } else {
    throw new Error("Button not found");
  }

  await page.waitForTimeout(4000);

  await browser.close();
})();
