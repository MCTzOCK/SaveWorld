/**
 * mobile/src/pages/fooddata/FoodDataViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.03.2024
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useParams } from "react-router";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";
import { useEffect } from "react";
import MobileBox from "../../components/MobileBox";
import { Box, Heading, Image, Stack, Text, chakra } from "@chakra-ui/react";
import NutriScore from "../../components/NutriScore";

export default function FoodDataViewer() {
  useRedirectForAnon();
  const [error, setError] = React.useState<string | null>(null);

  const [product, setProduct] = React.useState<{
    image_front_url: string;
    generic_name: string;
    ingredients: {
      text: string;
      vegan: string;
      vegetarian: string;
      percent: number;
    }[];
    ingredients_text: string;
    nutriscore_grade: string;
    nutriscore_score: number;
    packaging: string;
    product_name: string;
    quantity: string;
    ecoscore_data: {
      grade: "a" | "b" | "c" | "d" | "e";
      score: number;
      agribalyse: {
        co2_agriculture: number;
        co2_consumption: number;
        co2_distribution: number;
        co2_packaging: number;
        co2_processing: number;
        co2_total: number;
        co2_transportation: number;
      };
    };
  } | null>(null);

  const { ean } = useParams<{ ean: string }>();

  useEffect(() => {
    if (ean) loadProdInfo();
  }, [ean]);

  const loadProdInfo = async () => {
    const res = await fetch(
      "https://world.openfoodfacts.org/api/v2/product/" + ean + ".json",
    );

    if (res.status === 200) {
      const data = await res.json();
      setProduct(data.product);
    } else {
      setError($$("pages.fooddata.error.notfound"));
    }
  };

  return (
    <>
      <Page title={$$("pages.fooddata.title")}>
        <MobileBox>
          {error && (
            <>
              <Text>{error}</Text>
            </>
          )}
          {!error && product && (
            <>
              <Stack spacing={2}>
                <Box
                  w={"100%"}
                  minH={"200px"}
                  rounded={"lg"}
                  maxH={"200px"}
                  overflow={"hidden"}
                  backgroundImage={product.image_front_url}
                  backgroundPosition={"center"}
                  backgroundSize={"cover"}
                ></Box>
                <Heading size="md" textAlign={"center"}>
                  {product.product_name}
                </Heading>
                <Text>
                  <chakra.b color={"brand.500"}>
                    {$$("pages.fooddata.quantity")}:
                  </chakra.b>
                  &nbsp;
                  {product.quantity}
                </Text>
                <Text>
                  <chakra.b color={"brand.500"}>
                    {$$("pages.fooddata.packaging")}:
                  </chakra.b>
                  &nbsp;
                  {product.packaging}
                </Text>
                <chakra.b color={"brand.500"}>
                  {$$("pages.fooddata.nutriscore")}:
                </chakra.b>
                <NutriScore
                  grade={product.nutriscore_grade}
                  score={product.nutriscore_score}
                />
                <Text>{$$("pages.fooddata.nutriscore.description")}</Text>
                <chakra.b color={"brand.500"}>
                  {$$("pages.fooddata.ecoscore")}:
                </chakra.b>
                <NutriScore
                  grade={product.ecoscore_data.grade}
                  score={product.ecoscore_data.score}
                />
                <Text>
                  {$$(
                    // @ts-ignore
                    "pages.fooddata.ecoscore." + product.ecoscore_data.grade,
                  )}
                </Text>
                <chakra.b color={"brand.500"}>
                  {$$("pages.recipes.ingredients")}:
                </chakra.b>
                <Text>{product.ingredients_text}</Text>
              </Stack>
            </>
          )}
        </MobileBox>
      </Page>
    </>
  );
}
