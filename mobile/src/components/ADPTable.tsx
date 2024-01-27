/**
 * mobile/src/components/ADPTable.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.01.2024
 *
 */

import * as React from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import PopupManager from "../util/PopupManager";
import { FaEye } from "react-icons/fa";
import { REST } from "@saveworld/api-js";

export default function ADPTable(props: {
  schema: {
    [key: string]: string;
  };
  data: {
    [key: string]: any;
  }[];
  nextPage: () => void;
  prevPage: () => void;
  page: number;
  pages: number;
  reload: () => void;
  totalCount: number;
  model: string;
}) {
  return (
    <>
      <Flex w={"100%"} p={4} maxW={"98vw"} overflowX={"scroll"}>
        <Table>
          <Thead>
            <Th>#</Th>
            {Object.keys(props.schema).map((key) => (
              <Th>{key}</Th>
            ))}
          </Thead>
          <Tbody>
            {props.data.map((row, index) => (
              <Tr
                _hover={{
                  bg: "gray.700",
                }}
                cursor={"pointer"}
                onClick={async (e) => {
                  if (
                    ["svg", "button"].includes(
                      (e.target as HTMLElement).tagName.toLowerCase(),
                    )
                  )
                    return;

                  await PopupManager.alertAsync({
                    title: "Row " + index,
                    customSize: "4xl",
                    description: (
                      <>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(
                              e.target as HTMLFormElement,
                            );
                            const data = formData.get("data") as string;

                            try {
                              const json = JSON.parse(data);

                              const res = await REST.Admin.adpUpdate(
                                localStorage.getItem("token") as string,
                                props.model,
                                row["_id"],
                                JSON.parse(data),
                              );

                              if (res.status !== 200) {
                                await PopupManager.alertAsync({
                                  title: "Error",
                                  description: res.payload.error,
                                });
                                return;
                              }

                              await PopupManager.alertAsync({
                                title: "Success",
                                description: "Row updated!",
                              });

                              props.reload();
                            } catch (e: any) {
                              PopupManager.alertAsync({
                                title: "Error",
                                description: e.toString(),
                              });
                            }
                          }}
                        >
                          <Textarea
                            defaultValue={JSON.stringify(row, null, 2)}
                            height={"50vh"}
                            name={"data"}
                          />
                          <Flex
                            mt={4}
                            alignItems={"center"}
                            justifyContent={"center"}
                            w={"100%"}
                          >
                            <Button
                              bg={"white"}
                              color={"black"}
                              _hover={{ bg: "white", color: "black" }}
                              _focus={{ bg: "white", color: "black" }}
                              type={"submit"}
                            >
                              Save
                            </Button>
                          </Flex>
                        </form>
                      </>
                    ),
                  });
                }}
              >
                <Td>{index}</Td>
                {Object.keys(props.schema).map((key) => {
                  if (
                    (typeof row[key] === "string" ||
                      typeof row[key] === "number" ||
                      typeof row[key] === "boolean") &&
                    row[key].toString().length < 50
                  ) {
                    return <Td>{row[key].toString()}</Td>;
                  }
                  if (row[key] === null || row[key] === undefined) {
                    return <Td>N/A</Td>;
                  }
                  if (["{}", "[]"].includes(JSON.stringify(row[key]))) {
                    return <Td>Empty</Td>;
                  }
                  return (
                    <>
                      <Td>
                        <IconButton
                          bg={"white"}
                          color={"black"}
                          _hover={{ bg: "white", color: "black" }}
                          _focus={{ bg: "white", color: "black" }}
                          onClick={async () => {
                            let content = "";

                            content = JSON.stringify(row[key], null, 2);
                            await PopupManager.alertAsync({
                              title: key,
                              description: <pre>{content}</pre>,
                            });
                          }}
                          aria-label={"Reveal"}
                          icon={<FaEye />}
                        />
                      </Td>
                    </>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
          <TableCaption>
            Page {props.page} of {props.pages} <br />
            Total Entries: {props.totalCount}
          </TableCaption>
        </Table>
      </Flex>
      <Flex mt={4} alignItems={"center"} justifyContent={"center"}>
        <ButtonGroup>
          <Button
            onClick={() => {
              props.prevPage();
            }}
            isDisabled={props.page === 0}
          >
            Previous
          </Button>

          <Button
            onClick={() => {
              props.nextPage();
            }}
            isDisabled={props.page === props.pages - 1}
          >
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </>
  );
}
