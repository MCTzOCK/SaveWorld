/**
 * mobile/src/pages/e2-projects/StartE2Project.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 13.10.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js/index";
import { NOMINATIM_ENDPOINT } from "../../env";
import PopupManager from "../../util/PopupManager";
import { useIonRouter } from "@ionic/react";
import HighlightedText from "../../components/HighlightedText";
import MobileBox from "../../components/MobileBox";
import { $$ } from "../../translations/i18n";

export default function StartE2Project() {
  useRedirectForAnon();

  const [step, setStep] = React.useState(0);

  const [locationQuery, setLocationQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<string[]>([]);

  useEffect(() => {
    if (locationQuery.length < 5) return;

    REST.Nominatim.search(locationQuery, NOMINATIM_ENDPOINT).then((res) => {
      let lst: string[] = (res.payload as any[])
        .map((r) => r.display_name)
        .filter((v, i, a) => a.indexOf(v) === i);
      console.log(lst);
      setSearchResults(lst);
    });
  }, [locationQuery]);

  const router = useIonRouter();

  return (
    <>
      <Page title={$$("pages.e2projects.create")}>
        <MobileBox>
          <AnimatePresence>
            {step === 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Text>
                    <HighlightedText>
                      {$$("pages.e2projects.start.info.who")}
                    </HighlightedText>
                    <br />
                    {$$("pages.e2projects.start.info.description")}
                    <UnorderedList>
                      <li>{$$("pages.e2projects.start.info.ls.1")}</li>
                      <li>{$$("pages.e2projects.start.info.ls.2")}</li>
                      <li>{$$("pages.e2projects.start.info.ls.3")}</li>
                      <li>{$$("pages.e2projects.start.info.ls.4")}</li>
                      <li>{$$("pages.e2projects.start.info.ls.5")}</li>
                    </UnorderedList>
                    <Divider mt={4} mb={4} />
                    <Text>
                      <HighlightedText>
                        {$$("pages.e2projects.start.ready")}
                      </HighlightedText>
                      <br />
                      {$$("pages.e2projects.start.ready.2")}
                      <br />
                      <Button
                        mt={4}
                        w={"100%"}
                        color={"var(--ion-color-success)"}
                        onClick={() => {
                          setStep(1);
                        }}
                      >
                        {$$("pages.e2projects.start.ready.button")}
                      </Button>
                    </Text>
                  </Text>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step === 1 && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Text>
                    <HighlightedText>
                      {$$("pages.e2projects.start.page2.title")}
                    </HighlightedText>
                  </Text>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      let data = new FormData(e.target as HTMLFormElement);

                      const name = data.get("name") as string;
                      const startDate = data.get("startDate") as string;
                      const lastsDays = data.get("lastsDays") as string;
                      const geoLocation = data.get("geoLocation") as string;

                      const date = new Date(startDate);

                      if (date.getTime() < Date.now()) {
                        await PopupManager.alertAsync({
                          title: $$("control.error"),
                          description: $$(
                            "pages.e2projects.start.page2.error.date",
                          ),
                        });
                        return;
                      }

                      if (!name || !startDate || !lastsDays || !geoLocation) {
                        await PopupManager.alertAsync({
                          title: $$("control.error"),
                          description: $$("form.incomplete"),
                        });
                        return;
                      }

                      const res = await REST.EcoProjects.create(
                        localStorage.getItem("token") as string,
                        name,
                        startDate,
                        parseInt(lastsDays),
                        geoLocation,
                      );

                      if (res.status === 200) {
                        await PopupManager.alertAsync({
                          title: $$("pages.e2projects.start.created"),
                          description: $$(
                            "pages.e2projects.start.created.description",
                          ),
                        });
                        router.push("/e2-projects/my", "forward", "push");
                      } else {
                        await PopupManager.alertAsync({
                          title: $$("control.error"),
                          description: $$(
                            "pages.e2projects.start.create.error",
                            res.payload.error,
                          ),
                        });
                        return;
                      }
                    }}
                  >
                    <VStack spacing={4} mt={4}>
                      <FormControl>
                        <FormLabel>
                          {$$("pages.e2projects.start.form.name")}
                        </FormLabel>
                        <Input placeholder={"Mein Projekt"} name={"name"} />
                        <FormHelperText>
                          {$$("pages.e2projects.start.form.name.placeholder")}
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          {$$("pages.e2projects.start.form.date")}
                        </FormLabel>
                        <Input name={"startDate"} type={"date"} />
                        <FormHelperText>
                          {$$("pages.e2projects.start.form.date.placeholder")}
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          {$$("pages.e2projects.start.form.length")}
                        </FormLabel>
                        <Input
                          name={"lastsDays"}
                          type={"number"}
                          placeholder={"1"}
                        />
                        <FormHelperText>
                          {$$("pages.e2projects.start.form.length.placeholder")}
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <FormLabel>
                          {$$("pages.e2projects.start.form.location")}
                        </FormLabel>
                        <Input
                          name={"geoLocation"}
                          type={"text"}
                          value={locationQuery}
                          onChange={(e) => {
                            setLocationQuery(e.target.value);
                          }}
                          placeholder={"Unter den Linden, Berlin 10117"}
                        />
                        <FormHelperText>
                          {$$(
                            "pages.e2projects.start.form.location.placeholder",
                          )}
                        </FormHelperText>
                      </FormControl>
                      {searchResults.length > 0 && (
                        <>
                          <VStack>
                            <Text>
                              <b>
                                {$$(
                                  "pages.e2projects.start.form.suggestions.title",
                                )}
                              </b>
                            </Text>
                            {searchResults.map((s) => {
                              return (
                                <Box
                                  key={s}
                                  onClick={() => {
                                    setLocationQuery(s);
                                  }}
                                  color={"var(--ion-color-success)"}
                                  bg={"whiteAlpha.200"}
                                  p={2}
                                  rounded={"md"}
                                >
                                  {s}
                                </Box>
                              );
                            })}
                          </VStack>
                        </>
                      )}
                      <Button
                        color={"var(--ion-color-success)"}
                        type={"submit"}
                        w={"100%"}
                      >
                        {$$("pages.e2projects.start.ready.button")}
                      </Button>
                    </VStack>
                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </MobileBox>
      </Page>
    </>
  );
}
