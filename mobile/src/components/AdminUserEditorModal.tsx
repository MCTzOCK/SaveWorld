/**
 * mobile/src/components/AdminUserEditorModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 08.12.2023
 *
 */

import * as React from "react";
import SaveWorldModal from "./SaveWorldModal";
import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { REST } from "@saveworld/api-js";
import PopupManager from "../util/PopupManager";
import { FaTrash } from "react-icons/fa6";
import { $$ } from "../translations/i18n";

export default function AdminUserEditorModal(props: {
  user: {
    _id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    password: string;
    updatedAt: string;
    totpSecret: string;
    active: boolean;
    role: string;
    activationToken: string;
  };
  onClose: () => void;
  isOpen: boolean;
  reload: () => void;
}) {
  return (
    <>
      <SaveWorldModal
        title={props.user.username}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <Stack gap={6} mb={6}>
          <FormControl>
            <FormLabel>{$$("user.username")}</FormLabel>
            <Input
              isDisabled
              placeholder={$$("user.username")}
              value={props.user.username}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{$$("user.email")}</FormLabel>
            <Input
              type={"email"}
              placeholder={$$("user.email")}
              defaultValue={props.user.email}
              id={"user-email"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{$$("user.firstname")}</FormLabel>
            <Input
              placeholder={$$("user.firstname")}
              defaultValue={props.user.firstName}
              id={"user-firstname"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{$$("user.lastname")}</FormLabel>
            <Input
              placeholder={$$("user.lastname")}
              defaultValue={props.user.lastName}
              id={"user-lastname"}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{$$("user.password")}</FormLabel>
            <Input
              placeholder={$$("user.password")}
              type={"password"}
              id={"user-passwd"}
            />
          </FormControl>
          <HStack>
            <FormControl>
              <FormLabel>{$$("general.active")}</FormLabel>
              <Switch defaultChecked={props.user.active} id={"user-active"} />
              <FormHelperText>
                {$$("components.admin.user.can.login")}
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>{$$("menu.admin")}</FormLabel>
              <Switch
                defaultChecked={props.user.role === "admin"}
                colorScheme={"red"}
                id={"user-admin"}
              />
              <FormHelperText>
                {$$("components.admin.user.is.admin")}
              </FormHelperText>
            </FormControl>
          </HStack>
          <ButtonGroup>
            <Button
              color={"brand.500"}
              variant={"ghost"}
              w={"100%"}
              leftIcon={<FaSave />}
              onClick={async () => {
                const email = (
                  document.getElementById("user-email") as HTMLInputElement
                ).value;
                const firstName = (
                  document.getElementById("user-firstname") as HTMLInputElement
                ).value;
                const lastName = (
                  document.getElementById("user-lastname") as HTMLInputElement
                ).value;
                const passwd = (
                  document.getElementById("user-passwd") as HTMLInputElement
                ).value;
                const active = (
                  document.getElementById("user-active") as HTMLInputElement
                ).checked;
                const admin = (
                  document.getElementById("user-admin") as HTMLInputElement
                ).checked;

                const res = await REST.Admin.updateUser(
                  localStorage.getItem("token") as string,
                  props.user._id,
                  {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: passwd === "" ? undefined : passwd,
                    active: active,
                    role: admin ? "admin" : "user",
                  },
                );

                if (res.status === 200) {
                  PopupManager.alert({
                    title: $$("control.success"),
                    description: $$("components.admin.user.saved"),
                    callback: () => {
                      props.onClose();
                      props.reload();
                    },
                  });
                } else {
                  PopupManager.alert({
                    title: $$("control.error"),
                    description: $$(
                      "components.admin.user.save.error",
                      res.payload.error,
                    ),
                  });
                }
              }}
            >
              {$$("control.save")}
            </Button>
            <Button
              color={"red.500"}
              variant={"ghost"}
              w={"100%"}
              leftIcon={<FaTrash />}
              onClick={async () => {
                if (
                  !(await PopupManager.confirmAsync({
                    title: $$("control.delete"),
                    question: $$("components.admin.user.delete.confirm"),
                  }))
                )
                  return;

                const res = await REST.Admin.deleteUser(
                  localStorage.getItem("token") as string,
                  props.user._id,
                );

                if (res.status === 200) {
                  await PopupManager.alertAsync({
                    title: $$("control.success"),
                    description: $$("components.admin.user.delete.success"),
                  });

                  props.reload();
                  props.onClose();
                } else {
                  await PopupManager.alertAsync({
                    title: $$("control.error"),
                    description: $$(
                      "components.admin.user.delete.error",
                      res.payload.error,
                    ),
                  });
                }
              }}
            >
              {$$("control.error")}
            </Button>
          </ButtonGroup>
        </Stack>
      </SaveWorldModal>
    </>
  );
}
