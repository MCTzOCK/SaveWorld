/**
 * mobile/src/components/GhostArticle.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.11.2023
 *
 */

import * as React from "react";
import { useParams } from "react-router";
import { PostOrPage } from "@tryghost/content-api";
import { getGhostContentApi } from "../env";
import { useEffect } from "react";
import Page from "./Page";
import { Image } from "@chakra-ui/react";
import "../theme/ghost.scss";
import MobileBox from "./MobileBox";

export default function GhostArticle(props: { postId: string }) {
  const [post, setPost] = React.useState<PostOrPage>();

  const ghostApi = getGhostContentApi();

  useEffect(() => {
    ghostApi.posts
      .read({
        id: props.postId,
      })
      .then((post) => {
        setPost(post);
      });
  }, []);

  return (
    <>
      <Page title={post ? (post.title as string) : "Laden..."}>
        <MobileBox padding={"4"}>
          <div className={"ghost-post"}>
            {post && (
              <>
                {post.feature_image && (
                  <>
                    <Image src={post.feature_image as string} mb={2} />
                    <div
                      className={"ghost-post-image-caption"}
                      dangerouslySetInnerHTML={{
                        __html: post.feature_image_caption as string,
                      }}
                    ></div>
                  </>
                )}
                <div
                  dangerouslySetInnerHTML={{ __html: post.html as string }}
                />
              </>
            )}
          </div>
        </MobileBox>
      </Page>
    </>
  );
}
