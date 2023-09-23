/**
 * mobile/src/pages/community/CommunityBlogViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import { useParams } from "react-router";
import Page from "../../components/Page";

export default function CommunityBlogViewer() {
  useRedirectForAnon();

  const { id } = useParams<{ id: string }>();

  const [blog, setBlog] = React.useState<
    | {
        _id: string;
        title: string;
        content: string;
        tags: string[];
        comments: any[];
        likes: any[];
        createdAt: string;
      }
    | undefined
  >(undefined);

  return (
    <>
      <Page title={id}>123</Page>
    </>
  );
}
