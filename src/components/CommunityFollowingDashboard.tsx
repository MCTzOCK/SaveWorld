/**
 * mobile/src/components/CommunityFollowingDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.09.2023
 *
 */

import * as React from "react";
import { REST } from "@saveworld/api-js";
import { useEffect } from "react";
import CommunityBlogList from "./CommunityBlogList";
import PopupManager from "../util/PopupManager";

export default function CommunityFollowingDashboard() {
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

  const [pages, setPages] = React.useState(0);

  const loadPage = async (p: number) => {
    const res = await REST.Community.followingBlogEntries(
      localStorage.getItem("token") as string,
      p,
    );

    if (res.status === 200) {
      setBlogs(res.payload.entries);
      setPages(res.payload.pages);
    } else {
      PopupManager.alert({
        title: "Fehler",
        description: "Blogs konnten nicht geladen werden: " + res.payload.error,
      });
    }
  };

  useEffect(() => {
    loadPage(page);
  }, [page]);

  return (
    <>
      <CommunityBlogList
        blogs={blogs}
        page={page}
        pages={pages}
        setPage={setPage}
        showUsername={true}
      />
    </>
  );
}
