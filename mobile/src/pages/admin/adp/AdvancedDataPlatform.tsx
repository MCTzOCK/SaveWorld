/**
 * mobile/src/pages/admin/adp/AdvancedDataPlatform.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 27.01.2024
 *
 */

import * as React from "react";
import Page from "../../../components/Page";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";
import { $$ } from "../../../translations/i18n";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRedirectForAnon } from "../../../hooks/useRedirectForAnon";
import ADPSidebar from "../../../components/ADPSidebar";
import { FaHammer } from "react-icons/fa6";
import PopupManager from "../../../util/PopupManager";
import ADPTable from "../../../components/ADPTable";

export default function AdvancedDataPlatform() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const isMobile = useMediaQuery("(max-width: 800px)")[0];
  const [models, setModels] = React.useState<string[]>([]);
  const [schemas, setSchemas] = React.useState<{
    [key: string]: {
      [key: string]: string;
    };
  }>({});
  const [query, setQuery] = React.useState<string>("");
  const [model, setModel] = React.useState<string>("");
  const [result, setResult] = React.useState<
    | {
        [key: string]: any;
      }[]
    | null
  >(null);
  const [pages, setPages] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [totalCount, setTotalCount] = React.useState<number>(0);

  useEffect(() => {
    reloadModels();
  }, []);

  const reloadModels = async () => {
    const res = await REST.Admin.adpModels(
      localStorage.getItem("token") as string,
    );

    if (res.status !== 200) {
      return;
    }

    setModels(res.payload.models);
    setSchemas(res.payload.schemas);
  };

  const fire = async (opts: { query: object; model: string; page: number }) => {
    const res = await REST.Admin.insights(
      localStorage.getItem("token") as string,
      {
        filter: opts.query,
        model: opts.model,
        page: opts.page,
      },
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: "Error",
        description: res.payload.error,
      });
      return;
    }

    setResult(res.payload.entries);
    setPages(res.payload.pages);
    setPage(opts.page);
    setTotalCount(res.payload.count);
  };

  useEffect(() => {
    setResult(null);
    setPages(0);
    setPage(0);
    setTotalCount(0);
  }, [query, model]);

  if (isMobile) {
    return (
      <Page title={$$("pages.admin.adp")}>
        {$$("pages.admin.adp.mobile.disclaimer")}
      </Page>
    );
  }

  return (
    <Page title={$$("pages.admin.adp")} noPadding>
      <Flex w={"100%"} h={"fit-content"} minH={"100vh"} bg={"black"} gap={4}>
        {/*<ADPSidebar />*/}
        <Box flex={"100%"} mt={4} p={4}>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const formD = new FormData(e.target as HTMLFormElement);

              fire({
                query: JSON.parse(formD.get("query") as string),
                model: formD.get("model") as string,
                page: 0,
              });
            }}
          >
            <HStack w={"100%"} gap={4}>
              <Input
                placeholder={"Power Query filter"}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value as string);
                }}
                name={"query"}
                color={"white"}
                _placeholder={{ color: "white" }}
              />
              <Select
                placeholder={"Select a model"}
                flex={"20%"}
                onChange={(e) => {
                  setModel(e.target.value as string);
                }}
                name={"model"}
              >
                {models.map((model) => {
                  return <option value={model}>{model}</option>;
                })}
              </Select>
              <Button
                bg={"white"}
                color={"black"}
                _hover={{ bg: "white", color: "black" }}
                _focus={{ bg: "white", color: "black" }}
                type={"submit"}
              >
                Run
              </Button>
            </HStack>
          </form>
          {result !== null ? (
            <ADPTable
              schema={
                schemas[
                  Object.keys(schemas).find((key) => key === model) as string
                ]
              }
              data={result}
              totalCount={totalCount}
              nextPage={() => {
                if (page === pages - 1) {
                  return;
                }
                fire({
                  query: JSON.parse(query),
                  model: model,
                  page: page + 1,
                });
              }}
              prevPage={() => {
                if (page === 0) {
                  return;
                }
                fire({
                  query: JSON.parse(query),
                  model: model,
                  page: page - 1,
                });
              }}
              model={model}
              page={page}
              pages={pages}
              reload={() => {
                fire({
                  query: JSON.parse(query),
                  model: model,
                  page: page,
                });
              }}
            />
          ) : null}
        </Box>
      </Flex>
    </Page>
  );
}
