/**
 * mobile/src/pages/sustainability/SustainabilityPost.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 04.11.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import { useEffect } from "react";
import { getGhostContentApi } from "../../env";
import { PostOrPage } from "@tryghost/content-api";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Image,
} from "@chakra-ui/react";
import { IonButton, IonSearchbar, useIonRouter } from "@ionic/react";
import { useParams } from "react-router";

export default function SustainabilityPost() {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = React.useState<PostOrPage>();

  const ghostApi = getGhostContentApi();

  useEffect(() => {
    ghostApi.posts
      .read({
        id: id,
      })
      .then((post) => {
        setPost(post);
      });
  }, []);

  return (
    <>
      <Page title={post ? (post.title as string) : "Laden..."}>
        {post && (
          <>
            {post.feature_image && (
              <Image src={post.feature_image as string} mb={2} />
            )}
            <div dangerouslySetInnerHTML={{ __html: post.html as string }} />
          </>
        )}
      </Page>
    </>
  );
}
