/**
 * mobile/src/components/CommunitySearchDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.09.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
  IonSearchbar,
} from "@ionic/react";
import { checkmark, chevronDown } from "ionicons/icons";
import { IResponse, REST } from "@saveworld/api-js/index";
import { useEffect } from "react";
import CommunityBlogList from "./CommunityBlogList";
import CommunityProfileList from "./CommunityProfileList";
import PopupManager from "../util/PopupManager";
import { $$ } from "../translations/i18n";

export default function CommunitySearchDashboard() {
  const [query, setQuery] = React.useState<string>("");
  const [queryType, setQueryType] = React.useState<"profiles" | "posts">(
    "posts",
  );

  const [page, setPage] = React.useState(0);

  const [blogs, setBlogs] = React.useState<
    {
      _id: string;
      username: string;
      title: string;
      content: string;
      tags: string[];
      likes: string[];
      comments: any[];
      createdAt: string;
      __v: number;
    }[]
  >([]);

  const [profiles, setProfiles] = React.useState<
    {
      username: string;
      displayName: string;
      biography: string;
      location: string;
    }[]
  >([]);

  const [pages, setPages] = React.useState(0);

  const loadPage = async (p: number) => {
    let res: IResponse;

    if (queryType === "profiles") {
      res = await REST.Community.search(
        localStorage.getItem("token") as string,
        query,
        "profiles",
        page,
      );
    } else {
      res = await REST.Community.search(
        localStorage.getItem("token") as string,
        query,
        "posts",
        page,
      );
    }

    if (res.status === 200) {
      if (queryType === "posts") {
        setBlogs(res.payload.entries);
      } else {
        setProfiles(res.payload.entries);
      }
      setPages(res.payload.pages);
    } else {
      PopupManager.alert({
        title: $$("control.error"),
        description: $$(
          "components.community.data.loading.error",
          res.payload.error,
        ),
      });
    }
  };

  useEffect(() => {
    setPage(0);
    loadPage(0);
  }, [query, queryType]);

  useEffect(() => {
    loadPage(page);
  }, [page]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          alignItems: "center",
        }}
      >
        <IonSearchbar
          placeholder={$$("control.search")}
          value={query}
          onIonInput={(ev) => {
            setQuery(ev.detail.value as string);
          }}
        />
        <IonButton
          id={"open-type-popover"}
          size={"small"}
          fill={"outline"}
          color={"success"}
        >
          {queryType === "profiles"
            ? $$("components.community.search.profiles")
            : $$("components.admin.stats.blogs")}
          <IonIcon icon={chevronDown} slot={"end"} />
        </IonButton>
        <IonPopover trigger={"open-type-popover"} dismissOnSelect>
          <IonContent>
            <IonList>
              <IonItem
                button={true}
                detail={false}
                onClick={() => {
                  setQueryType("profiles");
                }}
                color={"light"}
              >
                {queryType === "profiles" && (
                  <IonIcon icon={checkmark} color={"success"} slot={"end"} />
                )}
                {$$("components.community.search.profiles")}
              </IonItem>
              <IonItem
                button={true}
                detail={false}
                onClick={() => {
                  setQueryType("posts");
                }}
                color={"light"}
              >
                {queryType === "posts" && (
                  <IonIcon icon={checkmark} color={"success"} slot={"end"} />
                )}
                {$$("components.community.search.blogs")}
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
      </div>
      {queryType === "posts" && (
        <>
          <CommunityBlogList
            blogs={blogs}
            page={page}
            pages={pages}
            setPage={setPage}
            showUsername
          />
        </>
      )}
      {queryType === "profiles" && (
        <>
          <CommunityProfileList
            profiles={profiles}
            page={page}
            pages={pages}
            setPage={setPage}
          />
        </>
      )}
    </>
  );
}
