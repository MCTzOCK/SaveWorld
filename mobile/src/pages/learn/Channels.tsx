/**
 * mobile/src/pages/learn/Channels.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { IonSearchbar, useIonRouter } from "@ionic/react";
import { useEffect, useState } from "react";
import { REST } from "@saveworld/api-js";
import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { $$ } from "../../translations/i18n";

export default function Channels() {
  const router = useIonRouter();

  const [query, setQuery] = React.useState("");
  const [channels, setChannels] = useState<
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
    REST.Content.categories().then((res) => {
      if (res.status === 200) {
        setChannels(res.payload as any);
      }
    });
  };

  return (
    <>
      <Page title={$$("pages.learn.channels")}>
        <IonSearchbar
          placeholder={$$("control.search")}
          onIonInput={(e) => setQuery(e.detail.value!)}
          value={query}
          style={{
            padding: 0,
          }}
        />
        {channels.filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.description.toLowerCase().includes(query.toLowerCase()),
        ).length > 0 && (
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
              "repeat(5, 1fr)",
            ]}
            gap={6}
          >
            {channels
              .filter(
                (c) =>
                  c.name.toLowerCase().includes(query.toLowerCase()) ||
                  c.description.toLowerCase().includes(query.toLowerCase()),
              )
              .map((c) => (
                <Card
                  key={c._id}
                  bg={"gray.900"}
                  as={Link}
                  href={"/learn/channels/" + c._id}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/learn/channels/" + c._id);
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
        )}
        {channels.filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.description.toLowerCase().includes(query.toLowerCase()),
        ).length === 0 && (
          <Text fontSize={"xl"} textAlign={"center"} mt={6}>
            {$$("general.no.results")}
          </Text>
        )}
      </Page>
    </>
  );
}
