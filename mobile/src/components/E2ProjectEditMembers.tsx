/**
 * mobile/src/components/E2ProjectEditMembers.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.10.2023
 *
 */

import * as React from "react";
import { E2Project } from "../util/types/E2Project";
import { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonSearchbar,
} from "@ionic/react";
import {
  Avatar,
  Box,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { ENDPOINT } from "../env";
import { FaHammer, FaTrash } from "react-icons/fa6";
import { FaPen, FaUser } from "react-icons/fa";
import PopupManager from "../util/PopupManager";
import { REST } from "@saveworld/api-js";
import { useUserData } from "../hooks/useUserData";

export default function E2ProjectEditMembers(props: {
  project: E2Project;
  reloadProject: () => void;
}) {
  const [query, setQuery] = useState<string>("");

  const { userInfo } = useUserData();

  return (
    <>
      <Box>
        <Text>
          Dein Projekt hat insgesamt {props.project.users.length} Mitglied
          {props.project.users.length > 1 ? "er" : ""}. Jedes Mitglied kann eine
          von drei Rollen haben:
          <List>
            <ListItem>
              <ListIcon as={FaHammer} color={"red.500"} />
              <chakra.span color={"red.500"} fontWeight={700}>
                Administrator
              </chakra.span>
              : Kann Projekt-Informationen, Homepage Segmente bearbeiten,
              Mitglieder verwalten und das Projekt löschen.
            </ListItem>
            <ListItem>
              <ListIcon as={FaPen} color={"blue.500"} />
              <chakra.span color={"blue.500"} fontWeight={700}>
                Editor
              </chakra.span>
              : Kann alles, was ein Administrator kann, außer das Projekt
              löschen und die Rollen von Mitglieder ändern.
            </ListItem>
            <ListItem>
              <ListIcon as={FaUser} color={"gray.500"} />
              <chakra.span color={"gray.500"} fontWeight={700}>
                Mitglied
              </chakra.span>
              : Kann alles einsehen, aber nichts bearbeiten.&nbsp;
              <chakra.span fontWeight={700}>(Standard-Rolle)</chakra.span>
            </ListItem>
          </List>
        </Text>
      </Box>

      <IonSearchbar
        placeholder={"Suchen"}
        value={query}
        onIonInput={(e) => setQuery(e.detail.value!)}
        style={{
          padding: 0,
        }}
      />
      {props.project.users
        .filter((user) => {
          if (query === "") return true;
          if (user.username.includes(query)) return true;
          return false;
        })
        .map((user) => {
          return (
            <>
              <IonCard
                style={{
                  margin: 0,
                }}
              >
                <IonCardContent>
                  <Flex
                    direction={"row"}
                    gap={4}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Avatar
                      src={
                        ENDPOINT +
                        "/media/profile-picture-username/" +
                        user.username
                      }
                    />
                    <Flex direction={"column"} alignItems={"flex-start"}>
                      <Heading
                        style={{
                          fontSize: "var(--chakra-fontSizes-2xl)",
                          fontFamily: "var(--chakra-fonts-heading)",
                          fontWeight: 700,
                        }}
                      >
                        {user.username}
                      </Heading>
                      <Text
                        style={{
                          fontSize: "var(--chakra-fontSizes-md)",
                          fontFamily: "var(--chakra-fonts-body)",
                          fontWeight: 600,
                        }}
                        color={
                          user.permissions === "ADMINISTRATOR"
                            ? "red.500"
                            : user.permissions === "EDITOR"
                            ? "blue.500"
                            : "gray.500"
                        }
                      >
                        {user.permissions === "ADMINISTRATOR"
                          ? "Administrator"
                          : user.permissions === "EDITOR"
                          ? "Editor"
                          : "Mitglied"}
                      </Text>
                    </Flex>
                    <ButtonGroup>
                      <IconButton
                        aria-label={"Entfernen"}
                        icon={<FaTrash />}
                        colorScheme={"red"}
                        onClick={async () => {
                          if (
                            !(await PopupManager.confirmAsync({
                              title: "Mitglied entfernen",
                              question:
                                "Möchtest du das Mitglied wirklich entfernen?",
                            }))
                          )
                            return;

                          const res = await REST.EcoProjects.removeMember(
                            localStorage.getItem("token") as string,
                            props.project._id,
                            user.userId,
                          );

                          if (res.status !== 200) {
                            await PopupManager.alertAsync({
                              title: "Fehler",
                              description: res.payload.error,
                            });
                          } else {
                            props.reloadProject();
                          }
                        }}
                      />
                      <IconButton
                        aria-label={"Rolle Ändern"}
                        icon={<FaHammer />}
                        display={
                          props.project.owner === userInfo._id ||
                          props.project.users.find(
                            (u) =>
                              u.userId === userInfo._id &&
                              u.permissions === "ADMINISTRATOR",
                          )
                            ? "inherit"
                            : "none"
                        }
                        colorScheme={"brand"}
                        onClick={async () => {
                          let newRoleS = await PopupManager.selectAsync({
                            title: "Rolle Ändern",
                            helperText:
                              "Wähle eine neue Rolle für das Mitglied",
                            choices: ["Administrator", "Editor", "Mitglied"],
                          });

                          if (!newRoleS) return;

                          let newRole: "ADMINISTRATOR" | "EDITOR" | "MEMBER" =
                            newRoleS === "Administrator"
                              ? "ADMINISTRATOR"
                              : newRoleS === "Editor"
                              ? "EDITOR"
                              : "MEMBER";

                          const res = await REST.EcoProjects.changeMemberRole(
                            localStorage.getItem("token") as string,
                            props.project._id,
                            user.userId,
                            newRole,
                          );

                          if (res.status !== 200) {
                            await PopupManager.alertAsync({
                              title: "Fehler",
                              description: res.payload.error,
                            });
                            return;
                          }

                          props.reloadProject();
                        }}
                      />
                    </ButtonGroup>
                  </Flex>
                </IonCardContent>
              </IonCard>
            </>
          );
        })}
    </>
  );
}
