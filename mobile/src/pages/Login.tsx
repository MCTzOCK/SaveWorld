/**
 * /Login.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonText,
  useIonRouter,
} from "@ionic/react";
import Page from "../components/Page";
import PopupManager from "../util/PopupManager";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Link,
  PinInput,
  PinInputField,
  Stack,
  Step,
  StepIcon,
  StepIndicator,
  Stepper,
  StepStatus,
  Text,
} from "@chakra-ui/react";
import MobileBox from "../components/MobileBox";
import { $$ } from "../translations/i18n";
import { REST } from "@saveworld/api-js";

export default function Login() {
  const router = useIonRouter();
  const [loading, setLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [email, setEmail] = React.useState("");

  return (
    <>
      <Page title={$$("page.login.title")}>
        <MobileBox>
          <Box bg={"gray.900"} rounded={"xl"} shadow={"xl"} p={4}>
            <Heading textAlign={"center"} fontWeight={1000}>
              {$$("page.login.title")}
            </Heading>
            {activeStep === 0 && (
              <form
                onSubmit={async (e) => {
                  setLoading(true);
                  e.preventDefault();
                  const email = (e.target as any).email.value;

                  const res = await REST.Account.loginCode(email);
                  setEmail(email);
                  setLoading(false);
                  if (res.status === 200) {
                    setActiveStep(1);
                  } else {
                    await PopupManager.alertAsync({
                      title: $$("control.error"),
                      description: res.payload.error,
                    });
                    return;
                  }
                }}
              >
                <Stack spacing={4}>
                  <Input
                    type={"email"}
                    placeholder={$$("user.email")}
                    name={"email"}
                    id={"login_register-email"}
                  />
                  <Button type={"submit"} variant={"brand"} isLoading={loading}>
                    {$$("page.login.title")}
                  </Button>
                  <Button
                    onClick={async () => {
                      const email = (
                        document.getElementById(
                          "login_register-email",
                        ) as HTMLInputElement
                      ).value;

                      if (!email) {
                        await PopupManager.alertAsync({
                          title: $$("control.error"),
                          description: $$("page.login.enter.email"),
                        });
                      }
                    }}
                    variant={"brand"}
                    isLoading={loading}
                  >
                    {$$("page.register.title")}
                  </Button>
                </Stack>
              </form>
            )}
            {activeStep === 1 && (
              <>
                <Text textAlign={"center"}>
                  {$$("page.login.enter.email.code")}
                </Text>
                <HStack mt={4} alignItems={"center"} justifyContent={"center"}>
                  <PinInput
                    size={"lg"}
                    onComplete={async (code) => {
                      setLoading(true);
                      const res = await REST.Account.loginCode(email, code);
                      if (res.status === 200) {
                        localStorage.setItem("token", res.payload.token);
                        window.location.href = "/";
                      } else {
                        await PopupManager.alertAsync({
                          title: $$("control.error"),
                          description: res.payload.error,
                        });
                        setLoading(false);
                        setActiveStep(0);
                      }
                    }}
                    isDisabled={loading}
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </>
            )}
          </Box>
        </MobileBox>
      </Page>
    </>
  );
}
