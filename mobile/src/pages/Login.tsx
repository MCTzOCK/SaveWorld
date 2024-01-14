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
import { REST } from "@saveworld/api-js";
import Page from "../components/Page";
import PopupManager from "../util/PopupManager";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import MobileBox from "../components/MobileBox";
import { $$ } from "../translations/i18n";

export default function Login() {
  const router = useIonRouter();
  return (
    <>
      <Page title={$$("page.login.title")}>
        <MobileBox>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const mail = (e.target as any).mail.value;
              const pass = (e.target as any).pass.value;

              const res = await REST.Account.login(mail, pass);

              if (res.status === 200) {
                localStorage.setItem("token", res.payload.token);
                const prefs = await REST.Account.preferences(res.payload.token);

                let hasInterests = false;

                if (!prefs.payload.prefs.interests) {
                  hasInterests = false;
                } else {
                  hasInterests = prefs.payload.prefs.interests.length > 0;
                }

                if (!hasInterests) {
                  router.push("/welcome", "none", "replace");
                } else {
                  router.push("/onboarding", "none", "replace");
                }
              } else {
                if (res.payload.error === "TOTP Code incorrect") {
                  const code = await PopupManager.promptAsync({
                    title: $$("page.login.2fa.popup.title"),
                    helperText: $$("page.login.2fa.popup.description"),
                    inputType: "INPUT",
                  });

                  if (!code) return;
                  const resp = await REST.Account.login(mail, pass, code);

                  if (resp.status === 200) {
                    localStorage.setItem("token", resp.payload.token);
                    const prefs = await REST.Account.preferences(
                      resp.payload.token,
                    );
                    let hasInterests: boolean;

                    if (!prefs.payload.prefs.interests) {
                      hasInterests = false;
                    } else {
                      hasInterests = prefs.payload.prefs.interests.length > 0;
                    }

                    if (!hasInterests) {
                      router.push("/welcome", "none", "replace");
                    } else {
                      router.push("/onboarding", "none", "replace");
                    }
                  } else {
                    PopupManager.alert({
                      title: $$("control.error"),
                      description: $$("page.login.error", res.payload.error),
                    });
                  }
                } else {
                  PopupManager.alert({
                    title: $$("control.error"),
                    description: $$("page.login.error", res.payload.error),
                  });
                }
              }
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                gap: "1.2rem",
              }}
            >
              <IonInput
                name={"mail"}
                type={"email"}
                placeholder={$$("user.email")}
                style={{
                  borderBottom: "1px solid var(--ion-color-success-shade)",
                }}
              />
              <div
                style={{
                  marginTop: "1.2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "1.2rem",
                }}
              >
                <IonInput
                  name={"pass"}
                  type={"password"}
                  placeholder={$$("user.password")}
                  style={{
                    borderBottom: "1px solid var(--ion-color-success-shade)",
                  }}
                />
              </div>
            </div>
            <Flex w={"100%"} direction={["column", "row"]} gap={4}>
              <Button
                type={"submit"}
                style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}
                w={"100%"}
                colorScheme={"brand"}
                size={"lg"}
              >
                {$$("page.login.title")}
              </Button>
              <Button
                as={Link}
                href={"/register"}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/register");
                }}
                style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}
                w={"100%"}
                color={"brand.500"}
                size={"lg"}
              >
                {$$("page.register.title")}
              </Button>
            </Flex>
          </form>
        </MobileBox>
      </Page>
    </>
  );
}
