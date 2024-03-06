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
  FormControl,
  FormLabel,
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
import { REST } from "@saveworld/api-js/index";

export default function Login() {
  const router = useIonRouter();
  const [loading, setLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [email, setEmail] = React.useState("");
  const [action, setAction] = React.useState<"login" | "register">("login");

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
                    setAction("login");
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
                        return;
                      }

                      setEmail(email);

                      setActiveStep(100);
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
                      if (action === "login") {
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
                      } else if (action === "register") {
                        const res = await REST.Account.registerCode(email, {
                          emailCode: code,
                        });
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
            {activeStep === 100 && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  const username = (e.target as any).username.value;
                  const firstname = (e.target as any).firstname.value;
                  const lastname = (e.target as any).lastname.value;

                  const res = await REST.Account.registerCode(email, {
                    username,
                    firstName: firstname,
                    lastName: lastname,
                  });
                  if (res.status !== 200) {
                    await PopupManager.alertAsync({
                      title: $$("control.error"),
                      description: res.payload.error,
                    });
                    setLoading(false);
                    return;
                  }

                  setLoading(false);
                  setActiveStep(1);
                  setAction("register");
                }}
              >
                <Stack gap={4}>
                  <FormControl isRequired>
                    <FormLabel>{$$("user.username")}</FormLabel>
                    <Input
                      type={"text"}
                      placeholder={$$("user.username")}
                      name={"username"}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{$$("user.firstname")}</FormLabel>
                    <Input
                      type={"text"}
                      placeholder={$$("user.firstname")}
                      name={"firstname"}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{$$("user.lastname")}</FormLabel>
                    <Input
                      type={"text"}
                      placeholder={$$("user.lastname")}
                      name={"lastname"}
                    />
                  </FormControl>
                  <Button variant={"brand"} isLoading={loading} type={"submit"}>
                    {$$("page.register.title")}
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveStep(0);
                    }}
                  >
                    {$$("control.back")}
                  </Button>
                </Stack>
              </form>
            )}
          </Box>
        </MobileBox>
      </Page>
    </>
  );
}
