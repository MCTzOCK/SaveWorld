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
import { REST } from "@saveworld/api-js/index";
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
import PopupManager from "../../../util/PopupManager";
import ADPTable from "../../../components/ADPTable";
import { FaChartPie } from "react-icons/fa6";
import { Bar, Pie } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

const defaultChartColors = {
  backgroundColor: [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
  ],
  borderColor: [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
  ],
  borderWidth: 1,
};

export default function AdvancedDataPlatform() {
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
  );
  useRedirectForAnon({
    onlyAdmins: true,
  });

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

  return (
    <Page title={$$("pages.admin.adp")} noPadding redGradient={true}>
      <Flex w={"100%"} h={"fit-content"} minH={"100vh"} bg={"black"} gap={4}>
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
                flex={"40%"}
                onChange={(e) => {
                  setModel(e.target.value as string);
                }}
                name={"model"}
              >
                {models.map((model) => {
                  return <option value={model}>{model}</option>;
                })}
              </Select>
              <IconButton
                bg={"white"}
                color={"black"}
                _hover={{ bg: "white", color: "black" }}
                _focus={{ bg: "white", color: "black" }}
                aria-label={"Plot Data"}
                icon={<FaChartPie />}
                onClick={async () => {
                  if (model === "") {
                    await PopupManager.alertAsync({
                      title: "Error",
                      description: "Please select a model first!",
                    });
                    return;
                  }

                  const type = await PopupManager.selectAsync({
                    title: "Select a plot type",
                    helperText: "Select a plot type",
                    choices: ["Bar", "Pie"],
                  });

                  if (!type) {
                    return;
                  }

                  const field = await PopupManager.selectAsync({
                    title: "Select a field to plot",
                    helperText: "Select a field to plot",
                    choices: Object.keys(
                      schemas[
                        Object.keys(schemas).find(
                          (key) => key === model,
                        ) as string
                      ],
                    ),
                  });

                  if (field === "") {
                    return;
                  }
                  if (type === "Pie") {
                    const res = await REST.Admin.adpPlotPie(
                      localStorage.getItem("token") as string,
                      model,
                      field,
                    );

                    if (res.status !== 200) {
                      await PopupManager.alertAsync({
                        title: "Error",
                        description: res.payload.error,
                      });
                      return;
                    }

                    await PopupManager.alertAsync({
                      title: "Plot",
                      description: (
                        <>
                          <Box height={"40vh"}>
                            <Pie
                              data={{
                                datasets: [
                                  {
                                    label: field,
                                    data: res.payload.data,
                                    ...defaultChartColors,
                                  },
                                ],
                                labels: res.payload.labels,
                              }}
                            />
                          </Box>
                        </>
                      ),
                    });
                  } else if (type === "Bar") {
                    const res = await REST.Admin.adpPlotBar(
                      localStorage.getItem("token") as string,
                      model,
                      field,
                    );

                    if (res.status !== 200) {
                      await PopupManager.alertAsync({
                        title: "Error",
                        description: res.payload.error,
                      });
                      return;
                    }

                    await PopupManager.alertAsync({
                      title: "Plot",
                      description: (
                        <>
                          <Box height={"40vh"}>
                            <Bar
                              data={{
                                datasets: [
                                  {
                                    label: field,
                                    data: res.payload.data,
                                    ...defaultChartColors,
                                  },
                                ],
                                labels: res.payload.labels,
                              }}
                            />
                          </Box>
                        </>
                      ),
                    });
                  }
                }}
              />
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
