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
  Input,
  Link,
  Stack,
} from "@chakra-ui/react";
import MobileBox from "../components/MobileBox";
import { $$ } from "../translations/i18n";
import { REST } from "@saveworld/api-js";

export default function Login() {
  const router = useIonRouter();
  const [loading, setLoading] = React.useState(false);
  return (
    <>
      <Page title={$$("page.login.title")}>
        <MobileBox>
          <Box bg={"gray.900"} rounded={"xl"} shadow={"xl"} p={4}>
            <Heading textAlign={"center"} fontWeight={1000}>
              {$$("page.login.title")}
            </Heading>
            <form
              onSubmit={async (e) => {
                setLoading(true);
                e.preventDefault();
                const email = (e.target as any).email.value;

                const res = await REST.Account.loginCode(email);
                if (res.status === 200) {
                  setLoading(false);
                }
              }}
            >
              <Stack spacing={4}>
                <Input
                  type={"email"}
                  placeholder={$$("user.email")}
                  name={"email"}
                />
                <Button type={"submit"} variant={"brand"} isLoading={loading}>
                  {$$("page.login.title")}
                </Button>
              </Stack>
            </form>
          </Box>
        </MobileBox>
      </Page>
    </>
  );
}
