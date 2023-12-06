/**
 * mobile/src/components/AllRecipes.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.12.2023
 *
 */

import * as React from "react";
import { REST } from "@saveworld/api-js";
import PopupManager from "../util/PopupManager";
import { useEffect } from "react";
import { IonSearchbar } from "@ionic/react";

export default function AllRecipes() {
  const [query, setQuery] = React.useState<string>("");
  const [recipes, setRecipes] = React.useState<
    {
      title: string;
      created_by: string;
      steps: string[];
      ingredients: string[];
    }[]
  >([]);
  const [pages, setPages] = React.useState(0);
  const [page, setPage] = React.useState(0);

  const loadPage = async (p: number) => {
    const res = await REST.Recipes.recipes(
      localStorage.getItem("token") as string,
      p,
      query,
    );

    if (res.status === 200) {
      setRecipes(res.payload.entries);
      setPages(res.payload.pages);
    } else {
      PopupManager.alert({
        title: "Fehler",
        description:
          "Rezepte konnten nicht geladen werden: " + res.payload.error,
      });
    }
  };

  useEffect(() => {
    setPage(0);
    loadPage(0);
  }, [query]);

  useEffect(() => {
    loadPage(page);
  }, [page]);

  return (
    <>
      <IonSearchbar
        placeholder={"Suchen"}
        value={query}
        onIonInput={(e) => setQuery(e.detail.value as string)}
        style={{
          padding: 0,
        }}
      ></IonSearchbar>
    </>
  );
}
