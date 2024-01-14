/**
 * mobile/src/components/Calculator.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.12.2023
 *
 */

import * as React from "react";
import MobileBox from "./MobileBox";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { FaAtom, FaHashtag } from "react-icons/fa";
import PopupManager from "../util/PopupManager";
import Page from "./Page";
import { ReactNode } from "react";
import { $$ } from "../translations/i18n";

export default function Calculator(props: {
  title: string;
  description: string | ReactNode;
  inputs: {
    label: string;
    id: string;
    type: "string" | "number" | "select";
    options?: { label: string; value: string }[];
  }[];
  calculate: (values: { [id: string]: any }) => string;
}) {
  const [values, setValues] = React.useState<{ [id: string]: string }>({});

  return (
    <>
      <Page title={props.title}>
        <MobileBox>
          <Text>{props.description}</Text>
          <Stack mt={6} gap={4}>
            {props.inputs.map((input) => {
              return (
                <FormControl>
                  <FormLabel>{input.label}</FormLabel>
                  {input.type === "string" || input.type === "number" ? (
                    <InputGroup>
                      <Input
                        type={"number"}
                        placeholder={input.label}
                        defaultValue={values[input.id]}
                        onChange={(e) => {
                          let newValues = values;
                          newValues[input.id] = e.target.value;
                          setValues(newValues);
                        }}
                      />
                    </InputGroup>
                  ) : (
                    <Select
                      onChange={(e) => {
                        let newValues = values;
                        newValues[input.id] = e.target.value;
                        setValues(newValues);
                      }}
                      value={values[input.id]}
                    >
                      {input.options?.map((option) => {
                        return (
                          <option value={option.value}>{option.label}</option>
                        );
                      })}
                    </Select>
                  )}
                </FormControl>
              );
            })}
            <Button
              color={"brand.500"}
              onClick={() => {
                const result = props.calculate(values);

                PopupManager.alertAsync({
                  title: $$("components.calc.result"),
                  description: (
                    <>
                      <Stat>
                        <StatLabel>
                          {$$("components.calc.result.co2")}
                        </StatLabel>
                        <StatNumber color={"brand.500"} fontWeight={900}>
                          {result}
                        </StatNumber>
                      </Stat>
                    </>
                  ),
                });
              }}
            >
              {$$("pages.tools.calc.calculate")}
            </Button>
          </Stack>
        </MobileBox>
      </Page>
    </>
  );
}
