/**
 * mobile/src/pages/AITest.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 21.01.2024
 *
 */
import Page from "../components/Page";
import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { aiPrompt } from "../util/ai";

export default function AITest() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState("");

  return (
    <Page title={"AI Test"}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData(e.target as HTMLFormElement);

          const x = formData.get("x");

          setLoading(true);

          setResult(
            await aiPrompt({
              prompt: x as string,
              maxTokens: 100,
            }),
          );

          setLoading(false);
        }}
      >
        <Input type={"text"} placeholder={"Prompt"} name={"x"} />
        <Button isLoading={loading} type={"submit"} colorScheme={"brand"}>
          Submit
        </Button>
      </form>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {result}
      </pre>
    </Page>
  );
}
