/**
 * mobile/src/components/HomeCard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 30.09.2023
 *
 */

import * as React from "react";
import { ReactNode } from "react";
import { IonCard, IonCardContent } from "@ionic/react";
import { chakra, Text } from "@chakra-ui/react";
import { FaLeaf } from "react-icons/fa6";

export default function HomeCard(props: {
  icon: ReactNode;
  text: string;
  url: string;
}) {
  return (
    <>
      <IonCard
        style={{
          backgroundColor: "rgba(10,10,10,.5)",
          border: "1px solid rgba(100,100,100,1)",
          maxWidth: "500px",
        }}
        routerLink={props.url}
      >
        <IonCardContent
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <chakra.span color={"brand.500"} fontSize={"4xl"}>
            {props.icon}
          </chakra.span>
          <div>
            <Text
              fontWeight={900}
              style={{
                fontFamily: "Inter, sans-serif",
              }}
            >
              {props.text}
            </Text>
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
}
