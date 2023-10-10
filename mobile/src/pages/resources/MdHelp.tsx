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

export default function MdHelp() {
  return (
    <>
      <Page title={"Markdown"}>
        <IonText>
          <p>
            Markdown ist eine einfache Auszeichnungssprache, die es dir
            ermöglicht, Texte schnell und einfach zu formatieren. Markdown wird
            vor allem im Forum verwendet, um Blog-Einträge zu verfassen. Du
            kannst allerdings auch ohne Markdown einen Eintrag erstellen. Im
            Folgenden findest du eine Übersicht über die wichtigsten
            Formatierungen.
          </p>
        </IonText>
        <hr
          style={{
            marginBottom: "20px",
            marginTop: "20px",
          }}
        />
        <IonText>
          <h1>Überschriften</h1>
          <p>
            Überschriften werden mit einem Hashtag eingeleitet. Je mehr
            Hashtags, desto kleiner die Überschrift. Maximal sind 6 Hashtags
            erlaubt. Beispiel:
          </p>
          <br />
          <p>
            <code># Überschrift 1</code>
          </p>
          <p>
            <code>## Überschrift 2</code>
          </p>
          <p>
            <code>### Überschrift 3</code>
          </p>
        </IonText>
        <br />
        <IonText>
          <h1>Textformatierung</h1>
          <p>
            Der Text kann mit einem Sternchen oder Unterstrich umschlossen
            werden, um ihn <b>fett</b> zu machen.
          </p>
          <br />
          <p>
            <code>*fetter Text*</code>
          </p>
          <p>
            <code>_fetter Text_</code>
          </p>
          <br />
          <p>
            Der Text kann mit zwei Sternchen oder Unterstrichen umschlossen
            werden, um ihn <i>kursiv</i> zu machen.
          </p>
          <br />
          <p>
            <code>**kursiver Text**</code>
          </p>
          <p>
            <code>__kursiver Text__</code>
          </p>
          <br />
          <p>
            Der Text kann mit drei Sternchen oder Unterstrichen umschlossen
            werden, um ihn{" "}
            <b>
              <i>fett und kursiv</i>
            </b>{" "}
            zu machen.
          </p>
          <br />
          <p>
            <code>***fetter und kursiver Text***</code>
          </p>
          <p>
            <code>___fetter und kursiver Text___</code>
          </p>
          <br />
          <p>
            Der Text kann mit einem Tilde umschlossen werden, um ihn{" "}
            <del>durchgestrichen</del> zu machen.
          </p>
          <br />
          <p>
            <code>~~durchgestrichener Text~~</code>
          </p>
        </IonText>
        <br />
        <IonText>
          <h1>Listen</h1>
          <p>
            Listen können mit einem Sternchen oder einer Zahl (für nummerierte
            Listen) eingeleitet werden. Beispiel:
          </p>
          <br />
          <p>
            <code>* Eintrag 1</code>
          </p>
          <p>
            <code>* Eintrag 2</code>
          </p>
          <p>
            <code>* Eintrag 3</code>
          </p>
          <br />
          <p>
            <code>1. Eintrag 1</code>
          </p>
          <p>
            <code>2. Eintrag 2</code>
          </p>
          <p>
            <code>3. Eintrag 3</code>
          </p>
        </IonText>
        <br />
        <IonText>
          <h1>Links</h1>
          <p>
            Links können mit eckigen Klammern und runden Klammern eingeleitet
            werden. Beispiel:
          </p>
          <br />
          <p>
            <code>[Linktext](https://saveworld.one)</code>
          </p>
        </IonText>
      </Page>
    </>
  );
}
