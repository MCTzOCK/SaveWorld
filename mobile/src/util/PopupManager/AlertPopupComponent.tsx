/**
 * mobile/src/util/PopupManager/AlertPopupComponent.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.09.2023
 *
 */

import * as React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { $$ } from "../../translations/i18n";

export default function AlertPopupComponent(props: {
  title: string | undefined;
  description: string | React.ReactNode;
  customSize?: string;
  onClose: () => void;
  inputType?: "INPUT" | "TEXTAREA";
}) {
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: true,
  });

  const whatEverRef = React.useRef();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={() => {
          onClose();
          props.onClose();
        }}
        isCentered
        // @ts-ignore
        leastDestructiveRef={whatEverRef}
        size={props.customSize || undefined}
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
          <AlertDialogContent bg={"#121212"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {props.title ? props.title : $$("popup.alert.title.default")}
            </AlertDialogHeader>

            <AlertDialogBody>{props.description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="brand"
                variant={"outline"}
                onClick={() => {
                  onClose();
                  props.onClose();
                }}
                ml={3}
              >
                {$$("popup.close")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
