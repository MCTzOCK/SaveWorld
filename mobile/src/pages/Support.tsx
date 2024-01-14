/**
 * mobile/src/pages/Support.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import * as React from "react";
import Page from "../components/Page";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import { useUserData } from "../hooks/useUserData";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FaEnvelope, FaTag } from "react-icons/fa";
import { useEffect } from "react";
import PopupManager from "../util/PopupManager";
import { REST } from "@saveworld/api-js";
import { useRedirectForAnon } from "../hooks/useRedirectForAnon";
import MobileBox from "../components/MobileBox";
import { __ } from "../translations/i18n";

export default function Support() {
  useRedirectForAnon();

  const [category, setCategory] = React.useState<string>("GENERAL");
  const [email, setEmail] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [additional, setAdditional] = React.useState<string>("");

  const [reportContent, setReportContent] = React.useState<boolean>(false);

  const { userInfo, loggedIn } = useUserData();

  useEffect(() => {
    if (loggedIn) {
      setEmail(userInfo.email);
    }
  }, [userInfo, loggedIn]);

  useEffect(() => {
    const usp = new URLSearchParams(window.location.search);

    if (usp.get("category") === "REPORT_USER") {
      if (usp.get("report_user")) {
        setCategory("REPORT-USER");
        setReportContent(true);
        setAdditional(usp.get("report_user") as string);
      }
    } else if (usp.get("category") === "REPORT_POST") {
      if (usp.get("report_post")) {
        setCategory("REPORT-POST");
        setReportContent(true);
        setAdditional(usp.get("report_post") as string);
      }
    } else if (usp.get("category") === "VIDEO_QUESTION") {
      if (usp.get("videoId")) {
        setCategory("VIDEO-QUESTION");
        setReportContent(true);
        setAdditional(usp.get("videoId") as string);
      }
    }
  }, []);

  return (
    <>
      <Page title={__("menu.support")}>
        <MobileBox>
          <VStack spacing={"1rem"}>
            <Text>
              {__("page.support.description")}&nbsp;
              <Link color={"brand.500"} href={"mailto:ben@saveworld.one"}>
                ben@saveworld.one
              </Link>
            </Text>
            <InputGroup>
              <InputLeftAddon>
                <FaEnvelope />
              </InputLeftAddon>
              <Input
                placeholder={__("user.email")}
                disabled={loggedIn}
                defaultValue={loggedIn ? userInfo.email : ""}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type={"email"}
              />
            </InputGroup>
            <Select
              placeholder={__("page.support.choose.category")}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              disabled={reportContent}
            >
              <option value={"GENERAL"}>
                {__("page.support.category.general")}
              </option>
              <option value={"REPORT-BUG"}>
                {__("page.support.category.error")}
              </option>
              {reportContent && (
                <>
                  <option value={"REPORT-USER"}>
                    {__("page.support.category.report.user")}
                  </option>
                  <option value={"REPORT-POST"}>
                    {__("page.support.category.report.post")}
                  </option>
                  <option value={"VIDEO-QUESTION"}>
                    {__("page.support.category.question.video")}
                  </option>
                </>
              )}
            </Select>
            <Textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              placeholder={__("general.more.details")}
            />
            {additional && (
              <>
                {category.startsWith("REPORT") ? (
                  <IonText>{__("page.support.attachment")}</IonText>
                ) : (
                  <IonText>{__("page.support.attachment.video")}</IonText>
                )}
              </>
            )}
          </VStack>
          <Button
            mt={4}
            w={"100%"}
            color={"brand.500"}
            onClick={async () => {
              if (!category) {
                await PopupManager.alertAsync({
                  title: __("control.error"),
                  description: __("page.support.form.missing.category"),
                });
                return;
              }

              if (!message) {
                await PopupManager.alertAsync({
                  title: __("control.error"),
                  description: __("page.support.form.missing.message"),
                });
                return;
              }

              if (
                !(await PopupManager.confirmAsync({
                  title: __("control.confirm"),
                  question: __("page.support.form.confirm"),
                }))
              )
                return;

              const res = await REST.Support.submit(
                email,
                category,
                message,
                additional,
              );

              if (res.status === 200) {
                await PopupManager.alertAsync({
                  title: __("control.success"),
                  description: __("page.support.success"),
                });
              } else {
                await PopupManager.alertAsync({
                  title: __("control.error"),
                  description: __("page.support.error", res.payload.error),
                });
              }
            }}
          >
            {__("general.submit")}
          </Button>
        </MobileBox>
      </Page>
    </>
  );
}
