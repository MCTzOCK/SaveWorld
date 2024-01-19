/**
 * mobile/src/pages/resources/MdHelp.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.10.23
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { IonText } from "@ionic/react";
import MobileBox from "../../components/MobileBox";
import { $$ } from "../../translations/i18n";

export default function MdHelp() {
  return (
    <>
      <Page title={"Markdown"}>
        <MobileBox>
          <IonText>
            <p>{$$("pages.markdown.description")}</p>
          </IonText>
          <hr
            style={{
              marginBottom: "20px",
              marginTop: "20px",
            }}
          />
          <IonText>
            <h1>{$$("pages.markdown.headlines")}</h1>
            <p>{$$("pages.markdown.headlines.description")}</p>
            <br />
            <p>
              <code>{$$("pages.markdown.headlines.1")}</code>
            </p>
            <p>
              <code>{$$("pages.markdown.headlines.2")}</code>
            </p>
            <p>
              <code>{$$("pages.markdown.headlines.3")}</code>
            </p>
          </IonText>
          <br />
          <IonText>
            <h1>{$$("pages.markdown.text.formatting")}</h1>
            <p>{$$("pages.markdown.text.formatting.bold.description")}</p>
            <br />
            <p>
              <code>{$$("pages.markdown.text.formatting.bold.1")}</code>
            </p>
            <p>
              <code>{$$("pages.markdown.text.formatting.bold.2")}</code>
            </p>
            <br />
            <p>{$$("pages.markdown.text.formatting.italic.description")}</p>
            <br />
            <p>
              <code>{$$("pages.markdown.text.formatting.italic.1")}</code>
            </p>
            <p>
              <code>{$$("pages.markdown.text.formatting.italic.2")}</code>
            </p>
            <br />
            <p>
              {$$("pages.markdown.text.formatting.bold.italic.description")}
            </p>
            <br />
            <p>
              <code>{$$("pages.markdown.text.formatting.bold.italic.1")}</code>
            </p>
            <p>
              <code>{$$("pages.markdown.text.formatting.bold.italic.2")}</code>
            </p>
            <br />
            <p>
              {$$("pages.markdown.text.formatting.strikethrough.description")}
            </p>
            <br />
            <p>
              <code>
                {$$("pages.markdown.text.formatting.strikethrough.1")}
              </code>
            </p>
          </IonText>
          <br />
          <IonText>
            <h1>{$$("pages.markdown.lists")}</h1>
            <p>{$$("pages.markdown.lists.description")}</p>
            <br />
            <p>
              <code>{$$("pages.markdown.lists.1")}</code>
            </p>
            <p>
              <code>{$$("pages.markdown.lists.2")}</code>
            </p>
            <br />
            <p>
              <code>{$$("pages.markdown.lists.3")}</code>
            </p>
            <p>
              <code>{$$("pages.markdown.lists.4")}</code>
            </p>
          </IonText>
          <br />
          <IonText>
            <h1>{$$("pages.markdown.links")}</h1>
            <p>{$$("pages.markdown.links.description")}</p>
            <br />
            <p>
              <code>{$$("pages.markdown.links.1")}</code>
            </p>
          </IonText>
        </MobileBox>
      </Page>
    </>
  );
}
