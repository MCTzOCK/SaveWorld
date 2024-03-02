/**
 * mobile/src/components/E2ProjectTodoLists.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 01.11.2023
 *
 */

import * as React from "react";
import { E2Project } from "../util/types/E2Project";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import PopupManager from "../util/PopupManager";
import {
  Button,
  ButtonGroup,
  Grid,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useIonRouter } from "@ionic/react";
import { $$ } from "../translations/i18n";

export default function E2ProjectTodoLists(props: {
  projectId: string;
  canAdd: boolean;
}) {
  const [lists, setLists] = useState<any[]>([]);

  useEffect(() => {
    reloadLists();
  }, []);

  const reloadLists = async () => {
    const res = await REST.EcoProjectsToDo.lists(
      localStorage.getItem("token") as string,
      props.projectId,
    );

    if (res.status === 200) {
      setLists(res.payload.lists);
    } else {
      await PopupManager.alertAsync({
        title: $$("control.error"),
        description: $$("components.e2projects.todo.loading.error"),
      });
    }
  };

  const router = useIonRouter();

  return (
    <>
      <ButtonGroup justifyContent={"flex-end"} w={"100%"}>
        <Button
          display={props.canAdd ? "initial" : "none"}
          color={"var(--ion-color-success)"}
          size={"lg"}
          isDisabled={!props.canAdd}
          onClick={async () => {
            const title = await PopupManager.promptAsync({
              title: $$("components.e2projects.todo.new"),
              helperText: $$("components.e2projects.todo.new.description"),
              inputType: "INPUT",
            });

            if (!title) return;

            const res = await REST.EcoProjectsToDo.createList(
              localStorage.getItem("token") as string,
              props.projectId,
              title,
            );

            if (res.status !== 200) {
              await PopupManager.alertAsync({
                title: $$("components.e2projects.todo.loading.error"),
                description: $$(
                  "components.e2projects.todo.new.error",
                  res.payload.error,
                ),
              });
              return;
            }

            await reloadLists();
          }}
        >
          {$$("components.e2projects.todo.new")}
        </Button>
      </ButtonGroup>
      {lists.length === 0 && (
        <Text fontSize={"lg"} textAlign={"center"}>
          {$$("components.e2projects.todo.no.lists")}
        </Text>
      )}

      <Table mt={4}>
        <Tbody>
          {lists.map((list) => {
            return (
              <>
                <Tr>
                  <Td w={"100%"}>{list.title}</Td>
                  <Td>
                    <ButtonGroup isAttached>
                      <IconButton
                        aria-label={$$("general.open")}
                        icon={<FaEye />}
                        color={"brand.500"}
                        onClick={() => {
                          router.push(
                            "/e2-projects/" +
                              props.projectId +
                              "/todos/" +
                              list._id,
                            "none",
                            "push",
                          );
                        }}
                      />
                      {props.canAdd && (
                        <IconButton
                          aria-label={$$("general.remove")}
                          icon={<FaTrash />}
                          color={"var(--ion-color-danger)"}
                          onClick={async () => {
                            if (
                              !(await PopupManager.confirmAsync({
                                title: $$("components.e2projects.todo.delete"),
                                question: $$(
                                  "components.e2projects.todo.delete.confirm",
                                ),
                              }))
                            )
                              return;

                            const res = await REST.EcoProjectsToDo.deleteList(
                              localStorage.getItem("token") as string,
                              props.projectId,
                              list._id,
                            );

                            if (res.status !== 200) {
                              await PopupManager.alertAsync({
                                title: $$("control.error"),
                                description: $$(
                                  "components.e2projects.todo.delete.error",
                                  res.payload.error,
                                ),
                              });
                              return;
                            }

                            await reloadLists();
                          }}
                        />
                      )}
                    </ButtonGroup>
                  </Td>
                </Tr>
              </>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}
