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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import PopupManager from "../util/PopupManager";
import { FaEye } from "react-icons/fa";

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
              <Tr>
                <Td>{index}</Td>
                {Object.keys(props.schema).map((key) => {
                  if (
                    (typeof row[key] === "string" ||
                      typeof row[key] === "number") &&
                    row[key].toString().length < 50
                  ) {
                    return <Td>{row[key]}</Td>;
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
