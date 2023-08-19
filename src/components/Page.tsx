/**
 * /Page.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import { IonBackButton, IonContent, IonPage, IonText } from "@ionic/react";

export default function Page(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <IonPage
        style={{
          overflow: "hidden",
        }}
      >
        <IonContent
          fullscreen
          style={{
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "0",
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                background: "linear-gradient(45deg, #8BFE6B 30%, #538EFF 90%)",
                width: "100%",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                height: "25%",
                rotate: "180deg",
              }}
            ></div>
          </div>

          <IonText
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              position: "relative",
              top: "17%",
              left: "5%",
            }}
            color={"white"}
          >
            {props.title}
          </IonText>

          <div
            style={{
              position: "relative",
              top: "20%",
              left: "4%",
              width: "92%",
              height: "fit-content",
              maxHeight: "75%",
              overflow: "scroll",
            }}
          >
            {props.children}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
