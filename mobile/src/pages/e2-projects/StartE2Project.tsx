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
import { REST } from "@saveworld/api-js";
import { NOMINATIM_ENDPOINT } from "../../env";
import PopupManager from "../../util/PopupManager";
import { useIonRouter } from "@ionic/react";
import HighlightedText from "../../components/HighlightedText";
import MobileBox from "../../components/MobileBox";

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
      <Page title={"Projekt starten"}>
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
                      Wer sollte ein neues Projekt starten?
                    </HighlightedText>
                    <br />
                    Nun ja, jeder der ein Projekt starten möchte. Das ist ja
                    auch der Sinn der Sache. Aber es gibt ein paar Dinge,&nbsp;
                    <HighlightedText>die du beachten solltest</HighlightedText>:
                    <UnorderedList>
                      <li>
                        Dein Projekt sollte einen{" "}
                        <HighlightedText>positiven Einfluss</HighlightedText>{" "}
                        auf die Umwelt haben.
                      </li>
                      <li>
                        Dein Projekt darf nicht gegen{" "}
                        <HighlightedText>geltendes Recht</HighlightedText>{" "}
                        verstoßen. (bspw. auf die Straße kleben)
                      </li>
                      <li>
                        Dein Projekt sollte auf{" "}
                        <HighlightedText>Zusammenarbeit</HighlightedText> mit
                        anderen Benutzern ausgelegt sein.
                      </li>
                      <li>
                        Dein Projekt sollte einen{" "}
                        <HighlightedText>konkreten Nutzen</HighlightedText>{" "}
                        haben (bspw. Müll sammeln, Bäume pflanzen, ...)
                      </li>
                      <li>
                        Dein Projekt sollte einem{" "}
                        <HighlightedText>ausgeklügelten Plan</HighlightedText>{" "}
                        folgen.
                      </li>
                    </UnorderedList>
                    <Divider mt={4} mb={4} />
                    <Text>
                      <HighlightedText>
                        Du bist bereit ein Projekt zu starten?
                      </HighlightedText>
                      <br />
                      Dann klicke auf den Button unten und fülle das Formular
                      aus.
                      <br />
                      <Button
                        mt={4}
                        w={"100%"}
                        color={"var(--ion-color-success)"}
                        onClick={() => {
                          setStep(1);
                        }}
                      >
                        Projekt starten
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
                    <HighlightedText>Neues Projekt</HighlightedText>
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
                          title: "Fehler",
                          description:
                            "Das Startdatum muss in der Zukunft liegen.",
                        });
                        return;
                      }

                      if (!name || !startDate || !lastsDays || !geoLocation) {
                        await PopupManager.alertAsync({
                          title: "Fehler",
                          description: "Bitte fülle alle Felder aus.",
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
                          title: "Projekt erstellt",
                          description:
                            "Dein Projekt wurde erfolgreich erstellt.",
                        });
                        router.push("/e2-projects/my", "none", "replace");
                      } else {
                        await PopupManager.alertAsync({
                          title: "Fehler",
                          description:
                            "Das Projekt konnte nicht erstellt werden: " +
                            res.payload.error,
                        });
                        return;
                      }
                    }}
                  >
                    <VStack spacing={4} mt={4}>
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input placeholder={"Mein Projekt"} name={"name"} />
                        <FormHelperText>
                          Gib deinem Projekt einen Namen, der es bestmöglich
                          beschreibt.
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Startdatum</FormLabel>
                        <Input name={"startDate"} type={"date"} />
                        <FormHelperText>
                          Wann soll dein Projekt starten?
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Länge</FormLabel>
                        <Input
                          name={"lastsDays"}
                          type={"number"}
                          placeholder={"1"}
                        />
                        <FormHelperText>
                          Wie lange soll dein Projekt dauern? (in Tagen)
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Ort</FormLabel>
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
                          Wo findet dein Projekt statt? TIPP: Ab 5 Zeichen
                          werden Vorschläge angezeigt. Klicke auf einen
                          Vorschlag um ihn zu übernehmen.
                        </FormHelperText>
                      </FormControl>
                      {searchResults.length > 0 && (
                        <>
                          <VStack>
                            <Text>
                              <b>Suchergebnisse</b>
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
                        Projekt starten
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
