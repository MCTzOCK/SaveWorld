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
import PopupManager from "../util/PopupManager";
import { useIonRouter } from "@ionic/react";
import { useUserData } from "../hooks/useUserData";
import { $$ } from "../translations/i18n";

export default function E2ProjectEditDetails(props: {
  project: E2Project;
  setProject: (p: E2Project) => void;
}) {
  const [locationQuery, setLocationQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<string[]>([]);

  const { userInfo } = useUserData();

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

  const router = useIonRouter();

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const data = new FormData(e.target as HTMLFormElement);
          const name = data.get("name") as string;
          const startDate = data.get("startDate") as string;
          const lastsDays = data.get("lastsDays") as string;
          const geoLocation = data.get("geoLocation") as string;

          if (new Date(startDate).getTime() < new Date().getTime()) {
            await PopupManager.alertAsync({
              title: $$("control.error"),
              description: $$("pages.e2projects.start.page2.error.date"),
            });
            return;
          }

          const res = await REST.EcoProjects.update(
            localStorage.getItem("token") as string,
            props.project._id,
            name,
            startDate,
            parseInt(lastsDays),
            geoLocation,
          );

          if (res.status === 200) {
            props.setProject(res.payload.project);
            await PopupManager.alertAsync({
              title: $$("control.success"),
              description: $$("components.e2projects.project.saved"),
            });
          } else {
            await PopupManager.alertAsync({
              title: $$("control.error"),
              description: $$(
                "components.e2projects.project.save.error",
                res.payload.error,
              ),
            });
          }
        }}
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>{$$("pages.e2projects.start.form.name")}</FormLabel>
            <Input
              defaultValue={props.project.name}
              placeholder={$$("pages.e2projects.start.form.name")}
              name={"name"}
            />
            <FormHelperText>
              {$$("pages.e2projects.start.form.name.placeholder")}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>{$$("pages.e2projects.start.form.date")}</FormLabel>
            <Input
              defaultValue={
                new Date(props.project.startDate).toISOString().split("T")[0]
              }
              name={"startDate"}
              type={"date"}
            />
            <FormHelperText>
              {$$("pages.e2projects.start.form.date.placeholder")}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>{$$("pages.e2projects.start.form.length")}</FormLabel>
            <Input
              defaultValue={props.project.lastsDays.toString()}
              name={"lastsDays"}
              type={"number"}
              placeholder={"1"}
            />
            <FormHelperText>
              {$$("pages.e2projects.start.form.length.placeholder")}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>{$$("pages.e2projects.start.form.location")}</FormLabel>
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
              {$$("pages.e2projects.start.form.location.placeholder")}
            </FormHelperText>
          </FormControl>
          {searchResults.length > 0 && (
            <>
              <VStack>
                <Text>
                  <b>{$$("pages.e2projects.start.form.suggestions.title")}</b>
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
            {$$("control.save")}
          </Button>
          <Button
            color={"var(--ion-color-danger)"}
            isDisabled={
              props.project.owner.toString() !== userInfo._id.toString()
            }
            onClick={async () => {
              if (
                !(await PopupManager.confirmAsync({
                  title: $$("pages.admin.e2projects.delete"),
                  question: $$("pages.admin.e2projects.delete.description"),
                }))
              )
                return;

              const res = await REST.EcoProjects.deleteProject(
                localStorage.getItem("token") as string,
                props.project._id,
              );

              if (res.status !== 200) {
                await PopupManager.alertAsync({
                  title: $$("control.error"),
                  description: $$(
                    "components.e2projects.project.delete.error",
                    res.payload.error,
                  ),
                });
                return;
              }

              router.push("/e2-projects/my", "none", "replace");
            }}
            w={"100%"}
          >
            {$$("control.delete")}
          </Button>
        </VStack>
      </form>
    </>
  );
}
