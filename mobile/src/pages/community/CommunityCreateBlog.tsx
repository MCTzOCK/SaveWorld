/**
 * mobile/src/pages/community/CommunityCreateBlog.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonText,
  useIonRouter,
} from "@ionic/react";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {
  accessibilityOutline,
  informationCircle,
  send,
  sendSharp,
} from "ionicons/icons";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";
import MDEditor from "@uiw/react-md-editor";
import MobileBox from "../../components/MobileBox";
import { Button } from "@chakra-ui/react";
import { uploadImage } from "../../util/files";
import { ENDPOINT } from "../../env";
import { $$ } from "../../translations/i18n";

export default function CommunityCreateBlog() {
  useRedirectForAnon();

  const [v, setV] = React.useState<string | undefined>("");
  const [title, setTitle] = React.useState<string>("");
  const [tags, setTags] = React.useState<string>("");
  const router = useIonRouter();

  const [preview, setPreview] = React.useState<boolean>(false);
  const [metadata, setMetadata] = React.useState<any>({});

  return (
    <>
      <Page title={$$("pages.community.create.blog.title")}>
        <MobileBox>
          <IonAccordionGroup
            style={{
              borderRadius: "var(--chakra-radii-lg)",
            }}
          >
            <IonAccordion
              value={"information"}
              style={{
                borderRadius: "var(--chakra-radii-lg)",
              }}
            >
              <IonItem slot="header" color="light">
                <IonLabel>
                  {$$("pages.community.create.blog.information")}
                </IonLabel>
                <IonIcon slot="end" icon={informationCircle} />
              </IonItem>
              <div className="ion-padding" slot="content">
                <IonText>
                  <p>
                    {$$("pages.community.create.blog.information.description")}
                  </p>
                </IonText>
                <IonText>
                  <p>
                    {$$(
                      "pages.community.create.blog.information.description.2",
                    )}{" "}
                    <a
                      onClick={() => {
                        router.push("/resources/md-help", "forward", "push");
                      }}
                      style={{
                        color: "var(--ion-color-success)",
                        fontWeight: 900,
                      }}
                    >
                      {$$("general.here")}
                    </a>{" "}
                    {$$(
                      "pages.community.create.blog.information.description.3",
                    )}
                  </p>
                </IonText>
                <IonText>
                  <p>
                    <b style={{ color: "var(--ion-color-success)" }}>
                      {$$("general.hint")}
                    </b>
                    : {$$("pages.community.create.blog.hint")}
                  </p>
                </IonText>
              </div>
            </IonAccordion>
          </IonAccordionGroup>
          <IonInput
            labelPlacement={"fixed"}
            label={$$("pages.community.create.blog.form.title")}
            placeholder={$$(
              "pages.community.create.blog.form.title.placeholder",
            )}
            type={"text"}
            onIonInput={(e) => setTitle(e.detail.value!)}
          />
          <IonInput
            labelPlacement={"fixed"}
            label={$$("pages.community.create.blog.form.tags")}
            placeholder={$$(
              "pages.community.create.blog.form.tags.placeholder",
            )}
            type={"text"}
            onIonInput={(e) => setTags(e.detail.value!)}
          />
          <Button
            color={"brand.500"}
            onClick={async () => {
              uploadImage((url) => {
                setV(
                  v +
                    "\n![" +
                    $$("general.image") +
                    "](" +
                    ENDPOINT +
                    url +
                    ")",
                );
              });
            }}
            w={"100%"}
            marginBottom={4}
            marginTop={2}
          >
            {$$("pages.community.create.blog.image")}
          </Button>
          <IonSegment
            value={preview ? "preview" : "edit"}
            style={{
              marginBottom: "1rem",
              marginTop: ".75rem",
            }}
          >
            <IonSegmentButton
              onClick={() => {
                setPreview(false);
              }}
              value={"edit"}
            >
              {$$("general.edit")}
            </IonSegmentButton>
            <IonSegmentButton
              onClick={() => {
                setPreview(true);
              }}
              value={"preview"}
            >
              {$$("general.preview")}
            </IonSegmentButton>
          </IonSegment>
          <MDEditor
            value={v}
            onChange={setV}
            hideToolbar={true}
            preview={preview ? "preview" : "edit"}
            style={{
              backgroundColor: "var(--ion-color-light)",
              color: "#fff",
              borderRadius: "10px",
            }}
          ></MDEditor>
          <Button
            w={"100%"}
            color={"brand.500"}
            mt={2}
            onClick={async () => {
              if (!v) return;

              if (v.length < 10) {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$(
                    "pages.community.create.blog.error.too.short",
                  ),
                });
                return;
              }

              if (!title) {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$("pages.community.create.blog.error.title"),
                });
                return;
              }

              const res = await REST.Community.createBlogEntry(
                localStorage.getItem("token") as string,
                title,
                v,
                tags.split(","),
              );

              if (res.status === 200) {
                router.push(
                  "/community/r/" + res.payload.entry._id,
                  "forward",
                  "push",
                );
              } else {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$(
                    "pages.community.create.blog.error",
                    res.payload.error,
                  ),
                });
              }
            }}
          >
            {$$("pages.community.create.blog.publish")}
          </Button>
        </MobileBox>
      </Page>
    </>
  );
}
