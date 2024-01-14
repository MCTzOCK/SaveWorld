/**
 * mobile/src/components/AdminSupportRequestModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.12.2023
 *
 */

import * as React from "react";
import SaveWorldModal from "./SaveWorldModal";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  useIonRouter,
} from "@ionic/react";
import PopupManager from "../util/PopupManager";
import { REST } from "@saveworld/api-js";
import { $$ } from "../translations/i18n";

export default function AdminSupportRequestModal(props: {
  request: {
    _id: string;
    email: string;
    category: string;
    additionalData: string;
    message: string;
    createdAt: string;
    processed: boolean;
    __v: number;
  };
  onClose: () => void;
  isOpen: boolean;
  reload: () => void;
}) {
  const router = useIonRouter();
  return (
    <>
      <SaveWorldModal
        title={
          props.request.category === "REPORT-USER"
            ? $$("pages.admin.support.category.user")
            : props.request.category === "REPORT-POST"
            ? $$("pages.admin.support.category.post")
            : props.request.category === "REPORT-BUG"
            ? $$("pages.admin.support.category.bug")
            : $$("pages.admin.support.category.other")
        }
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        {props.request && (
          <>
            {props.request.processed && (
              <>
                <Alert status={"success"} borderRadius={"md"}>
                  <AlertIcon />
                  <AlertDescription>
                    {$$("pages.admin.support.request.processed")}
                  </AlertDescription>
                </Alert>
              </>
            )}
            <Text fontSize={"lg"} mt={4}>
              {$$(
                "components.admin.support.request",
                new Date(props.request.createdAt).toLocaleDateString(),
                new Date(props.request.createdAt).toLocaleTimeString(),
                props.request.email,
              )}
              <br />
              <br />
              {$$("components.admin.support.request.message")}
              <br />
              <pre>{props.request.message}</pre>
            </Text>
            <ButtonGroup w={"100%"} mt={4}>
              <Button
                w={"100%"}
                color={"brand.500"}
                onClick={() => {
                  if (props.request.category === "REPORT-USER") {
                    router.push("/community/u/" + props.request.additionalData);
                  } else if (props.request.category === "REPORT-POST") {
                    router.push("/community/r/" + props.request.additionalData);
                  }
                }}
                display={
                  !(
                    props.request.category === "REPORT-USER" ||
                    props.request.category === "REPORT-POST"
                  )
                    ? "none"
                    : "initial"
                }
                isDisabled={props.request.processed}
              >
                {props.request.category === "REPORT-USER"
                  ? $$("components.admin.support.request.button.profile")
                  : $$("components.admin.support.request.button.post")}
              </Button>
              <Button
                w={"100%"}
                color={"brand.500"}
                isDisabled={props.request.processed}
                onClick={async () => {
                  if (
                    props.request.category === "GENERAL" ||
                    props.request.category === "REPORT-BUG" ||
                    props.request.category === "VIDEO-QUESTION"
                  ) {
                    const message = await PopupManager.promptAsync({
                      title: $$("pages.admin.support.request.answer"),
                      helperText: $$(
                        "pages.admin.support.request.answer.description",
                      ),
                      inputType: "TEXTAREA",
                    });

                    if (!message) return;

                    const res = await REST.Admin.processSupportRequest(
                      localStorage.getItem("token") as string,
                      props.request._id,
                      message,
                    );

                    if (res.status === 200) {
                      props.reload();
                      props.onClose();
                    } else {
                      PopupManager.alert({
                        title: $$("control.error"),
                        description: $$(
                          "pages.admin.support.request.answer.error",
                          res.payload.error,
                        ),
                      });
                    }
                  } else if (props.request.category === "REPORT-POST") {
                    const action = await PopupManager.selectAsync({
                      title: $$("pages.admin.support.request.action.choose"),
                      helperText: $$(
                        "pages.admin.support.request.action.description",
                      ),
                      choices: [
                        $$("pages.admin.support.request.action.delete.post"),
                        $$("pages.admin.support.request.action.no"),
                      ],
                    });
                    if (!action) return;

                    const message = await PopupManager.promptAsync({
                      title: $$("pages.admin.support.request.answer"),
                      helperText: $$(
                        "pages.admin.support.request.answer.description",
                      ),
                      inputType: "TEXTAREA",
                    });
                    if (!message) return;

                    if (
                      action ===
                      $$("pages.admin.support.request.action.delete.post")
                    ) {
                      const res = await REST.Community.deleteBlogEntry(
                        localStorage.getItem("token") as string,
                        props.request.additionalData,
                      );

                      if (res.status !== 200) {
                        PopupManager.alert({
                          title: $$("control.error"),
                          description: $$(
                            "pages.admin.support.request.error.post",
                            res.payload.error,
                          ),
                        });
                        return;
                      }
                    }

                    const res = await REST.Admin.processSupportRequest(
                      localStorage.getItem("token") as string,
                      props.request._id,
                      message,
                    );

                    if (res.status === 200) {
                      props.reload();
                      props.onClose();
                    } else {
                      PopupManager.alert({
                        title: $$("control.error"),
                        description: $$(
                          "pages.admin.support.request.error",
                          res.payload.error,
                        ),
                      });
                    }
                  } else if (props.request.category === "REPORT-USER") {
                    const action = await PopupManager.selectAsync({
                      title: $$("pages.admin.support.request.action.choose"),
                      helperText: $$(
                        "pages.admin.support.request.action.description",
                      ),
                      choices: [
                        $$("pages.admin.support.request.action.delete.user"),
                        $$("pages.admin.support.request.action.no"),
                      ],
                    });
                    if (!action) return;

                    const message = await PopupManager.promptAsync({
                      title: $$("pages.admin.support.request.answer"),
                      helperText: $$(
                        "pages.admin.support.request.answer.description",
                      ),
                      inputType: "TEXTAREA",
                    });
                    if (!message) return;

                    if (
                      action ===
                      $$("pages.admin.support.request.action.delete.user")
                    ) {
                      const res = await REST.Admin.deleteUser(
                        localStorage.getItem("token") as string,
                        props.request.additionalData,
                      );

                      if (res.status !== 200) {
                        PopupManager.alert({
                          title: $$("control.error"),
                          description: $$(
                            "pages.admin.support.request.error.user",
                            res.payload.error,
                          ),
                        });
                        return;
                      }
                    }

                    const res = await REST.Admin.processSupportRequest(
                      localStorage.getItem("token") as string,
                      props.request._id,
                      message,
                    );

                    if (res.status === 200) {
                      props.reload();
                      props.onClose();
                    } else {
                      PopupManager.alert({
                        title: $$("control.error"),
                        description: $$(
                          "pages.admin.support.request.error",
                          res.payload.error,
                        ),
                      });
                    }
                  }
                }}
              >
                {$$("pages.admin.support.request.answer.complete")}
              </Button>
            </ButtonGroup>
          </>
        )}
      </SaveWorldModal>
    </>
  );
}
