/**
 * mobile/src/components/AdminVideoEditModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 09.12.2023
 *
 */

import * as React from "react";
import SaveWorldModal from "./SaveWorldModal";
import { useParams } from "react-router";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../util/PopupManager";
import {
  IonInput,
  IonItem,
  IonList,
  IonText,
  IonTextarea,
  IonToggle,
  useIonRouter,
} from "@ionic/react";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { $$ } from "../translations/i18n";

export default function AdminVideoEditModal(props: {
  isOpen: boolean;
  onClose: () => void;
  reload: (n: number) => void;
  video: {
    _id: string;
    title: string;
    description: string;
    streamUrl: string;
    thumbnailUrl: string;
    categories: string[];
    sources: string[];
  };
}) {
  const router = useIonRouter();

  const [categories, setCategories] = React.useState<
    {
      _id: string;
      name: string;
      description: string;
      image: string;
    }[]
  >([]);

  const { id } = useParams<{ id: string }>();

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );

  const [sources, setSources] = React.useState<string[]>([]);

  useEffect(() => {
    REST.Content.categories().then((res) => {
      if (res.status === 200) {
        setCategories(res.payload as any);
      } else {
        PopupManager.alert({
          title: $$("control.error"),
          description: $$(
            "pages.admin.category.loading.error",
            res.payload.error,
          ),
        });
      }
    });
  }, []);

  useEffect(() => {
    setSelectedCategories(props.video.categories);
  }, [props.video]);

  return (
    <>
      <SaveWorldModal
        title={props.video.title}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        <Stack gap={6}>
          <FormControl>
            <FormLabel>{$$("pages.admin.video.form.title")}</FormLabel>
            <Input
              id={"update-video-title"}
              defaultValue={props.video.title}
              placeholder={$$("pages.admin.video.form.title")}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{$$("pages.admin.video.form.description")}</FormLabel>
            <Textarea
              id={"update-video-desc"}
              defaultValue={props.video.description}
              placeholder={$$("pages.admin.video.form.description")}
            />
          </FormControl>
          <FormControl>
            <FormLabel>{$$("pages.admin.video.form.sources")}</FormLabel>
            <Textarea
              onChange={(e) => {
                setSources(e.target.value.split("\n") || []);
              }}
              value={sources.join("\n")}
              id={"create-vid-sources"}
              placeholder={$$("pages.admin.video.form.sources.placeholder")}
            />
          </FormControl>
          <Text>{$$("components.video.create.categories")}</Text>
          {categories.map((c) => {
            return (
              <>
                <IonItem color={"light"}>
                  <IonToggle
                    slot={"end"}
                    checked={selectedCategories.includes(c._id)}
                    onIonChange={(ev) => {
                      if (ev.detail.checked) {
                        setSelectedCategories([...selectedCategories, c._id]);
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((sc) => sc !== c._id),
                        );
                      }
                    }}
                  />
                  {c.name}
                </IonItem>
              </>
            );
          })}
        </Stack>
        <ButtonGroup mt={4} w={"100%"}>
          <Button
            leftIcon={<FaSave />}
            color={"brand.500"}
            w={"100%"}
            onClick={async () => {
              const title = (
                document.getElementById(
                  "update-video-title",
                ) as HTMLInputElement
              ).value as string;
              const desc = (
                document.getElementById(
                  "update-video-desc",
                ) as HTMLTextAreaElement
              ).value as string;

              const res = await REST.Admin.updateVideo(
                localStorage.getItem("token") as string,
                props.video!._id,
                title,
                desc,
                selectedCategories,
                sources,
              );
              if (res.status === 200) {
                PopupManager.alert({
                  title: $$("control.success"),
                  description: $$("pages.admin.video.updated.success"),
                  callback: () => {
                    router.push(router.routeInfo.pathname);
                  },
                });
              } else {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$(
                    "pages.admin.video.updated.error",
                    res.payload.error,
                  ),
                });
              }
            }}
          >
            {$$("control.save")}
          </Button>
          <Button
            leftIcon={<FaTrash />}
            color={"red.500"}
            w={"100%"}
            onClick={async () => {
              if (
                !(await PopupManager.confirmAsync({
                  title: $$("control.delete"),
                  question: $$("pages.admin.video.delete.confirm"),
                }))
              )
                return;

              const res = await REST.Admin.deleteVideo(
                localStorage.getItem("token") as string,
                props.video?._id,
              );

              if (res.status === 200) {
                PopupManager.alert({
                  title: $$("control.success"),
                  description: $$("pages.admin.video.deleted"),
                  callback: () => {
                    router.push(router.routeInfo.pathname);
                  },
                });
              } else {
                PopupManager.alert({
                  title: $$("control.error"),
                  description: $$(
                    "pages.admin.video.deleted.error",
                    res.payload.error,
                  ),
                });
              }
            }}
          >
            {$$("control.delete")}
          </Button>
        </ButtonGroup>
      </SaveWorldModal>
    </>
  );
}
