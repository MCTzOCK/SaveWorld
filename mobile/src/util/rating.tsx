/**
 * mobile/src/util/rating.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.03.2024
 *
 */
import PopupManager from "./PopupManager";
import { $$ } from "../translations/i18n";
import { chakra, HStack, IconButton } from "@chakra-ui/react";
import { RateApp } from "capacitor-rate-app";
import { isPlatform } from "@ionic/react";

export async function requestRating() {
  if (isPlatform("ios") && localStorage.getItem("rated") !== "true") {
    localStorage.setItem("rated", "true");
    await PopupManager.alertAsync({
      title: $$("general.rating.title"),
      description: (
        <>
          <HStack spacing={4} w={"100%"}>
            <IconButton
              w={"100%"}
              aria-label={"1 Star"}
              icon={<chakra.span fontSize={"2xl"}>&#128545;</chakra.span>}
            />
            <IconButton
              w={"100%"}
              aria-label={"2 Star"}
              icon={<chakra.span fontSize={"2xl"}>&#128533;</chakra.span>}
            />
            <IconButton
              w={"100%"}
              aria-label={"3 Star"}
              icon={<chakra.span fontSize={"2xl"}>&#128566;</chakra.span>}
            />
            <IconButton
              w={"100%"}
              aria-label={"4 Star"}
              icon={<chakra.span fontSize={"2xl"}>&#128578;</chakra.span>}
              onClick={requestRealRating}
            />
            <IconButton
              w={"100%"}
              aria-label={"5 Star"}
              icon={<chakra.span fontSize={"2xl"}>&#128525;</chakra.span>}
              onClick={requestRealRating}
            />
          </HStack>
        </>
      ),
    });
  }
}

export async function requestRealRating() {
  RateApp.requestReview();
}
