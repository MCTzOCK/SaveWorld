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
import { $$ } from "../../../../translations/i18n";

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
        title: $$("control.error"),
        description: $$(
          "pages.e2projects.loading.error",
          projectRes.payload.error,
        ),
      });
    }

    setProject(projectRes.payload.project);

    const listRes = await REST.EcoProjectsToDo.items(
      localStorage.getItem("token") as string,
      listId,
    );

    if (listRes.status !== 200) {
      await PopupManager.alertAsync({
        title: $$("control.error"),
        description: $$(
          "pages.e2projects.todo.loading.error",
          listRes.payload.error,
        ),
      });
    }

    setItems(listRes.payload.entries);
  };

  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemDesc, setNewItemDesc] = useState<string>("");

  if (!project) {
    return <Page title={$$("general.loading")}>{$$("general.loading")}</Page>;
  }

  return (
    <>
      <Page title={project.name + ": " + $$("pages.e2projects.todo")}>
        <MobileBox padding={"4"}>
          <Heading mb={4}>{$$("pages.e2projects.todo")}</Heading>
          <TableContainer maxW={"100%"}>
            <Table w={"100%"}>
              <Thead>
                <Tr>
                  <Th>{$$("pages.e2projects.todo.name")}</Th>
                  <Th>{$$("pages.e2projects.todo.description")}</Th>
                  <Th>{$$("pages.e2projects.todo.done")}</Th>
                  <Th>{$$("pages.e2projects.todo.action")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {(project.owner.toString() === userInfo._id.toString() ||
                  project.users.find((m) => m.permissions !== "MEMBER") !==
                    undefined) && (
                  <Tr>
                    <Td>
                      <Input
                        placeholder={$$("pages.e2projects.todo.name")}
                        value={newItemName}
                        onChange={(e) => {
                          setNewItemName(e.target.value);
                        }}
                      />
                    </Td>
                    <Td>
                      <Textarea
                        placeholder={$$("pages.e2projects.todo.description")}
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
                              title: $$("control.error"),
                              description: $$(
                                "pages.e2projects.todo.entry.create.error",
                                res.payload.error,
                              ),
                            });
                            return;
                          }

                          reload();
                          setNewItemDesc("");
                          setNewItemName("");
                        }}
                      >
                        {$$("general.create")}
                      </Button>
                    </Td>
                  </Tr>
                )}
                {items.length === 0 ? (
                  <>
                    <Tr>
                      <Td>{$$("pages.e2projects.todo.entries.no")}</Td>
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
                                          title: $$("control.error"),
                                          description: $$(
                                            "pages.e2projects.todo.entry.update.error",
                                            res.payload.error,
                                          ),
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
                                          title: $$("control.error"),
                                          question: $$(
                                            "pages.e2projects.todo.entry.delete.confirm",
                                          ),
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
                                          title: $$("control.error"),
                                          description: $$(
                                            "pages.e2projects.todo.entry.delete.error",
                                            res.payload.error,
                                          ),
                                        });
                                        return;
                                      }

                                      await reload();
                                    }}
                                    aria-label={$$("control.delete")}
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
