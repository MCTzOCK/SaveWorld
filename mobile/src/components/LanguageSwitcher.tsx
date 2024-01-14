// THIS FILE SHOULD NOT BE TRANSLATED BECAUSE IT IS USED TO SWITCH THE LANGUAGE

/**
 * mobile/src/components/LanguageSwitcher.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.01.2024
 *
 */

import * as React from "react";
import Page from "./Page";
import {
  Box,
  chakra,
  Flex,
  Grid,
  Heading,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Preferences } from "@capacitor/preferences";
import MobileBox from "./MobileBox";
import { getLanguages } from "../translations/i18n";
import { Browser } from "@capacitor/browser";
import { FaHome } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";

const languages = getLanguages().languages as any;
export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = React.useState("en");

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    Preferences.get({ key: "language" }).then((res) => {
      if (res.value) {
        setCurrentLang(res.value);
      } else {
        setCurrentLang("en");
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Page title={"Languages"}>
        <Flex
          w={"100%"}
          h={"100vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Spinner size={"xl"} color={"brand.500"} />
        </Flex>
      </Page>
    );
  }

  return (
    <>
      <Page title={"Languages"}>
        <MobileBox>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap={4}
          >
            {Object.keys(languages).map((lang) => {
              return (
                <Box
                  bgColor={"gray.900"}
                  p={5}
                  w={"100%"}
                  h={"100%"}
                  rounded={"xl"}
                  shadow={"2xl"}
                  cursor={"pointer"}
                  onClick={() => {
                    Preferences.set({ key: "language", value: lang });
                    window.location.reload();
                  }}
                  border={
                    currentLang === lang ? "3px solid #2CD36E" : undefined
                  }
                >
                  <Flex
                    direction={"column"}
                    w={"100%"}
                    alignItems={"center"}
                    zIndex={12}
                  >
                    <chakra.span color={"orange.400"} fontSize={"6xl"}>
                      <ReactCountryFlag
                        countryCode={languages[lang].cc}
                        style={{
                          fontSize: "2em",
                        }}
                      />
                    </chakra.span>
                    <Heading color={"white"} fontSize={"2xl"} fontWeight={1000}>
                      {languages[lang].displayName}
                    </Heading>
                    <Text color={"white"} fontSize={"md"} fontWeight={1000}>
                      {languages[lang].type === "auto"
                        ? "Automatically translated"
                        : "Manually translated"}
                    </Text>
                  </Flex>
                </Box>
              );
            })}
          </Grid>
        </MobileBox>
      </Page>
    </>
  );
}
