/**
 * mobile/src/components/E2ProjectEditDetails.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */
import { E2Project } from "../util/types/E2Project";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";
import { NOMINATIM_ENDPOINT } from "../env";

export default function E2ProjectEditDetails(props: { project: E2Project }) {
  const [locationQuery, setLocationQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<string[]>([]);

  useEffect(() => {
    if (props.project) {
      setLocationQuery(props.project.geoLocationDisplayName);
    }
  }, [props.project]);

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

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              defaultValue={props.project.name}
              placeholder={"Mein Projekt"}
              name={"name"}
            />
            <FormHelperText>
              Gib deinem Projekt einen Namen, der es bestmöglich beschreibt.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Startdatum</FormLabel>
            <Input
              defaultValue={
                new Date(props.project.startDate).toISOString().split("T")[0]
              }
              name={"startDate"}
              type={"date"}
            />
            <FormHelperText>Wann soll dein Projekt starten?</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Länge</FormLabel>
            <Input
              defaultValue={props.project.lastsDays.toString()}
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
              Wo findet dein Projekt statt? TIPP: Ab 5 Zeichen werden Vorschläge
              angezeigt. Klicke auf einen Vorschlag um ihn zu übernehmen.
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
          <Button color={"var(--ion-color-success)"} type={"submit"} w={"100%"}>
            Speichern
          </Button>
        </VStack>
      </form>
    </>
  );
}
