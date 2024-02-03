/**
 * mobile/src/components/AccountAppIconModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 03.02.2024
 *
 */

import * as React from "react";
import SaveWorldModal from "./SaveWorldModal";
import { $$ } from "../translations/i18n";
import { IconOptions, AppIcon } from "@capacitor-community/app-icon";
import { useEffect } from "react";
import { Box, Heading, HStack, Image, Stack, VStack } from "@chakra-ui/react";

const APP_ICONS: IconOptions[] = [
  {
    name: "classic",
    suppressNotification: false,
    disable: ["modern"],
  },
  {
    name: "modern",
    suppressNotification: false,
    disable: ["classic"],
  },
];

export default function AccountAppIconModal(props: {
  onClose: () => void;
  isOpen: boolean;
}) {
  const [currentIcon, setCurrentIcon] = React.useState<string>("");

  useEffect(() => {
    AppIcon.getName().then((name) => {
      setCurrentIcon(name.value || APP_ICONS[0].name);
    });
  }, []);

  return (
    <>
      <SaveWorldModal
        title={$$("page.account.update.app.icon")}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <Stack spacing={4}>
          {APP_ICONS.map((icon, index) => {
            return (
              <>
                <Box
                  key={index}
                  bg={index % 2 === 0 ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,.7)"}
                  p={4}
                  onClick={async () => {
                    await AppIcon.change(
                      APP_ICONS.find((i) => i.name === icon.name) ||
                        APP_ICONS[0],
                    );
                    window.location.assign("/");
                  }}
                >
                  <HStack spacing={4}>
                    <Image
                      src={"/assets/icons/" + icon.name + ".png"}
                      width={24}
                    />
                    <Heading size={"lg"}>{icon.name}</Heading>
                  </HStack>
                </Box>
              </>
            );
          })}
        </Stack>
      </SaveWorldModal>
    </>
  );
}
