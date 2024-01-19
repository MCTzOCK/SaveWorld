/**
 * /Register.tsx
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
  IonInput,
  IonItem,
  IonList,
  useIonRouter,
} from "@ionic/react";
import { REST } from "@saveworld/api-js";
import Page from "../components/Page";
import PopupManager from "../util/PopupManager";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import MobileBox from "../components/MobileBox";
import { $$ } from "../translations/i18n";

export default function Register() {
  const router = useIonRouter();
  return (
    <>
      <Page title={$$("general.welcome")}>
        <MobileBox>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const mail = (e.target as any).mail.value;
              const user = (e.target as any).user.value;
              const firstName = (e.target as any).firstName.value;
              const lastName = (e.target as any).lastName.value;
              const pass = (e.target as any).pass.value;
              const passConf = (e.target as any).passConf.value;

              if (
                !mail ||
                !user ||
                !firstName ||
                !lastName ||
                !pass ||
                !passConf
              ) {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$("form.incomplete"),
                });
                return;
              }

              if (pass !== passConf) {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$("form.passwords.error.not.match"),
                });
                return;
              }

              const res = await REST.Account.register({
                mail: mail,
                firstName: firstName,
                lastName: lastName,
                password: pass,
                username: user,
              });

              if (res.status === 200) {
                PopupManager.alert({
                  title: $$("control.success"),
                  description: $$("page.register.success"),
                });
                router.push("/login", "none", "replace");
              } else {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$("page.register.error", res.payload.error),
                });
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
                name={"user"}
                placeholder={$$("user.username")}
                style={{
                  borderBottom: "1px solid var(--ion-color-success-shade)",
                }}
              />
              <IonInput
                name={"mail"}
                type={"email"}
                placeholder={$$("user.email")}
                style={{
                  borderBottom: "1px solid var(--ion-color-success-shade)",
                }}
              />
            </div>
            <div
              style={{
                marginTop: "1.2rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                gap: "1.2rem",
              }}
            >
              <IonInput
                name={"firstName"}
                placeholder={$$("user.firstname")}
                style={{
                  borderBottom: "1px solid var(--ion-color-success-shade)",
                }}
              />
              <IonInput
                name={"lastName"}
                placeholder={$$("user.lastname")}
                style={{
                  borderBottom: "1px solid var(--ion-color-success-shade)",
                }}
              />
            </div>
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
              <IonInput
                name={"passConf"}
                type={"password"}
                placeholder={$$("user.password.confirm")}
                style={{
                  borderBottom: "1px solid var(--ion-color-success-shade)",
                }}
              />
            </div>
            <Flex w={"100%"} direction={["column", "row"]} gap={4}>
              <Button
                type={"submit"}
                style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}
                w={"100%"}
                colorScheme={"brand"}
                size={"lg"}
              >
                {$$("page.register.title")}
              </Button>
              <Button
                as={Link}
                href={"/login"}
                style={{ marginTop: "1.2rem", marginBottom: "1.2rem" }}
                w={"100%"}
                color={"brand.500"}
                size={"lg"}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/login");
                }}
              >
                {$$("page.login.title")}
              </Button>
            </Flex>
          </form>
        </MobileBox>
      </Page>
    </>
  );
}
