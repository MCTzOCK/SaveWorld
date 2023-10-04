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
        size={props.customSize ? props.customSize : "sm"}
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
          <AlertDialogContent bg={"black"} maxWidth={"85%"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {props.title ? props.title : "Meldung"}
            </AlertDialogHeader>

            <AlertDialogBody>{props.description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="saveworld_green"
                variant={"outline"}
                onClick={() => {
                  onClose();
                  props.onClose();
                }}
                ml={3}
              >
                Schließen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
