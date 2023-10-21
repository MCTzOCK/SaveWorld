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
  chakra,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { ENDPOINT } from "../env";
import { FaHammer } from "react-icons/fa6";
import { FaPen, FaUser } from "react-icons/fa";

export default function E2ProjectEditMembers(props: {
  project: E2Project;
  reloadProject: () => void;
}) {
  const [query, setQuery] = useState<string>("");

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
              löschen.
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
                  <Flex direction={"row"} gap={4} alignItems={"center"}>
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
                  </Flex>
                </IonCardContent>
              </IonCard>
            </>
          );
        })}
    </>
  );
}
