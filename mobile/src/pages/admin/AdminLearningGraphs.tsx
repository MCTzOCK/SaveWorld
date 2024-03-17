/**
 * mobile/src/pages/admin/AdminLearningGraphs.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.02.2024
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js/index";
import { translateOnlineV3 } from "../../util/online-translate";
import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { useIonRouter } from "@ionic/react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";

export default function AdminLearningGraphs() {
  useRedirectForAnon({
    onlyAdmins: true,
  });
  const [categories, setCategories] = useState<
    {
      _id: string;
      name: string;
      description: string;
      image: string;
    }[]
  >([]);

  useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    REST.Content.categories().then(async (res) => {
      if (res.status === 200) {
        let chan = res.payload as any;
        setCategories(res.payload as any);
      }
    });
  };

  const router = useIonRouter();

  return (
    <>
      <Page title={$$("components.learning.graphs")} redGradient>
        <Grid
          templateColumns={[
            "repeat(1, 1fr)",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)",
            "repeat(5, 1fr)",
          ]}
          gap={6}
        >
          {categories.map((c) => (
            <Card
              key={c._id}
              bg={"gray.900"}
              as={Link}
              href={"/admin/learning-graphs/" + c._id}
              onClick={(e) => {
                e.preventDefault();
                router.push("/admin/learning-graphs/" + c._id);
              }}
            >
              <Image src={c.image} roundedTop={"md"} />
              <CardHeader>
                <Text fontWeight={"bold"} fontSize={"xl"}>
                  {c.name}
                </Text>
              </CardHeader>
              <CardBody>
                <Text fontSize={"lg"}>{c.description}</Text>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Page>
    </>
  );
}
