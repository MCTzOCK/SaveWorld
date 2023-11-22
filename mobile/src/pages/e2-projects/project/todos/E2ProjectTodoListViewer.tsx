/**
 * mobile/src/pages/e2-projects/project/todos/E2ProjectTodoListViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.11.2023
 *
 */

import * as React from "react";
import Page from "../../../../components/Page";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../../../util/PopupManager";
import { E2Project } from "../../../../util/types/E2Project";
import MobileBox from "../../../../components/MobileBox";
import {
  Avatar,
  Button,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useUserData } from "../../../../hooks/useUserData";
import { FaDeleteLeft, FaTrash } from "react-icons/fa6";
import { ENDPOINT } from "../../../../env";

export default function E2ProjectTodoListViewer() {
  const { id, listId } = useParams<{
    id: string;
    listId: string;
  }>();

  const { userInfo } = useUserData();

  const [items, setItems] = React.useState<any[]>([]);
  const [project, setProject] = React.useState<E2Project>();

  useEffect(() => {
    if (!id || !listId) return;

    reload();
  }, [id, listId]);

  const reload = async () => {
    const projectRes = await REST.EcoProjects.project(
      localStorage.getItem("token") as string,
      id,
    );

    if (projectRes.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Das Projekt konnte nicht geladen werden: " +
          projectRes.payload.error,
      });
    }

    setProject(projectRes.payload.project);

    const listRes = await REST.EcoProjectsToDo.items(
      localStorage.getItem("token") as string,
      listId,
    );

    if (listRes.status !== 200) {
      await PopupManager.alertAsync({
        title: "Fehler",
        description:
          "Die ToDo-Liste konnte nicht geladen werden: " +
          listRes.payload.error,
      });
    }

    setItems(listRes.payload.entries);
  };

  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemDesc, setNewItemDesc] = useState<string>("");

  if (!project) {
    return <Page title={"Laden..."}>Laden...</Page>;
  }

  return (
    <>
      <Page title={project.name + ": ToDo Liste"}>
        <MobileBox padding={"4"}>
          <Heading mb={4}>ToDo-Liste</Heading>
          <TableContainer maxW={"100%"}>
            <Table w={"100%"}>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Beschreibung</Th>
                  <Th>Erledigt</Th>
                  <Th>Aktion</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(project.owner.toString() === userInfo._id.toString() ||
                  project.users.find((m) => m.permissions !== "MEMBER") !==
                    undefined) && (
                  <Tr>
                    <Td>
                      <Input
                        placeholder={"Name"}
                        value={newItemName}
                        onChange={(e) => {
                          setNewItemName(e.target.value);
                        }}
                      />
                    </Td>
                    <Td>
                      <Textarea
                        placeholder={"Beschreibung"}
                        value={newItemDesc}
                        onChange={(e) => {
                          setNewItemDesc(e.target.value);
                        }}
                      />
                    </Td>
                    <Td></Td>
                    <Td>
                      <Button
                        color={"var(--ion-color-success)"}
                        onClick={async () => {
                          const res = await REST.EcoProjectsToDo.createItem(
                            localStorage.getItem("token") as string,
                            id,
                            listId,
                            newItemName,
                            newItemDesc,
                          );

                          if (res.status !== 200) {
                            await PopupManager.alertAsync({
                              title: "Fehler",
                              description:
                                "Eintrag konnte nicht erstellt werden: " +
                                res.payload.error,
                            });
                            return;
                          }

                          reload();
                          setNewItemDesc("");
                          setNewItemName("");
                        }}
                      >
                        Erstellen
                      </Button>
                    </Td>
                  </Tr>
                )}
                {items.length === 0 ? (
                  <>
                    <Tr>
                      <Td>Diese ToDo-Liste hat keine Einträge.</Td>
                      <Td />
                      <Td />
                    </Tr>
                  </>
                ) : (
                  <>
                    {items.map((item) => {
                      return (
                        <>
                          <Tr>
                            <Td>{item.title}</Td>
                            <Td>{item.description}</Td>
                            <Td>
                              {item.checked ? (
                                <>
                                  <Flex gap={2} alignItems={"center"}>
                                    <Avatar
                                      src={
                                        ENDPOINT +
                                        "/media/profile-picture-username/" +
                                        item.checkedBy
                                      }
                                    />
                                    <Text>
                                      {new Date(
                                        item.checkedAt,
                                      ).toLocaleString()}
                                    </Text>
                                  </Flex>
                                </>
                              ) : (
                                <>
                                  <Checkbox
                                    onChange={async () => {
                                      const res =
                                        await REST.EcoProjectsToDo.checkItem(
                                          localStorage.getItem(
                                            "token",
                                          ) as string,
                                          id,
                                          listId,
                                          item._id,
                                        );

                                      if (res.status !== 200) {
                                        await PopupManager.alertAsync({
                                          title: "Fehler",
                                          description:
                                            "Der Eintrag konnte nicht geändert werden: " +
                                            res.payload.error,
                                        });
                                        return;
                                      }

                                      await reload();
                                    }}
                                    size={"lg"}
                                    colorScheme={"brand"}
                                  />
                                </>
                              )}
                            </Td>
                            <Td>
                              {(project.owner.toString() ===
                                userInfo._id.toString() ||
                                project.users.find(
                                  (m) => m.permissions !== "MEMBER",
                                ) !== undefined) && (
                                <>
                                  <IconButton
                                    onClick={async () => {
                                      if (
                                        !(await PopupManager.confirmAsync({
                                          title: "Löschen",
                                          question:
                                            "Soll der Eintrag wirklich gelöscht werden?",
                                        }))
                                      )
                                        return;

                                      const res =
                                        await REST.EcoProjectsToDo.deleteItem(
                                          localStorage.getItem(
                                            "token",
                                          ) as string,
                                          id,
                                          listId,
                                          item._id,
                                        );
                                      if (res.status !== 200) {
                                        await PopupManager.alertAsync({
                                          title: "Fehler",
                                          description:
                                            "Der Eintrag konnte nicht gelöscht werden: " +
                                            res.payload.error,
                                        });
                                        return;
                                      }

                                      await reload();
                                    }}
                                    aria-label={"Löschen"}
                                    icon={<FaTrash />}
                                    color={"var(--ion-color-danger)"}
                                  />
                                </>
                              )}
                            </Td>
                          </Tr>
                        </>
                      );
                    })}
                  </>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </MobileBox>
      </Page>
    </>
  );
}
