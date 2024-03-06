/**
 * mobile/src/components/AdminCreateVideoModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.09.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonProgressBar,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { REST } from "@saveworld/api-js/index";
import { ENDPOINT } from "../env";
import { useEffect } from "react";
import PopupManager from "../util/PopupManager";
import SaveWorldModal from "./SaveWorldModal";
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
  Switch,
  Tag,
  TagCloseButton,
  TagLabel,
  Textarea,
} from "@chakra-ui/react";
import { FaPlus, FaYoutube } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { $$ } from "../translations/i18n";

export default function AdminCreateVideoModal(props: {
  callback: () => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [categories, setCategories] = React.useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    REST.Content.categories().then((res) => {
      if (res.status === 200) {
        setCategories(res.payload as any);
      }
    });
  }, []);

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  );

  const [sources, setSources] = React.useState<string[]>([]);

  const [uploading, setUploading] = React.useState<boolean>(false);

  return (
    <>
      <SaveWorldModal
        title={$$("components.video.create")}
        isOpen={props.isOpen}
        onClose={props.onClose}
      >
        {uploading && (
          <IonProgressBar type={"indeterminate"} color={"success"} />
        )}
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (selectedCategories.length < 1) {
              PopupManager.alert({
                title: $$("control.error"),
                description: $$("components.video.form.no.category"),
              });
              return;
            }

            let x = e.target as HTMLFormElement;

            const name = (x.elements.namedItem("name") as HTMLInputElement)
              .value;
            const desc = (
              x.elements.namedItem("description") as HTMLInputElement
            ).value;
            const id = (x.elements.namedItem("youtubeId") as HTMLInputElement)
              .value;

            if (!name || !desc || !id) {
              PopupManager.alert({
                title: $$("control.error"),
                description: $$("form.incomplete"),
              });
              return;
            }

            const body = {
              title: name,
              description: desc,
              categories: selectedCategories,
              sources: sources,
              youtubeVideoId: id,
            };

            setUploading(true);

            const res = await REST.Admin.createVideo(
              localStorage.getItem("token") as string,
              name,
              desc,
              id,
              selectedCategories,
              sources,
            );

            setUploading(false);
            setSelectedCategories([]);
            if (res.status === 200) {
              props.callback();
              props.onClose();
            } else {
              PopupManager.alert({
                title: $$("control.error"),
                description: $$(
                  "components.video.create.error",
                  res.payload.error,
                ),
              });
              props.onClose();
            }
          }}
        >
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>{$$("components.video.create.youtube.id")}</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  <FaYoutube />
                </InputLeftAddon>
                <Input
                  name={"youtubeId"}
                  type={"text"}
                  placeholder={"MakGA7Y77YI"}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>{$$("components.video.create.name")}</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  <FaPen />
                </InputLeftAddon>
                <Input
                  name={"name"}
                  type={"text"}
                  placeholder={$$("components.video.create.name")}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>{$$("components.video.create.description")}</FormLabel>
              <Textarea
                name={"description"}
                placeholder={$$("components.video.create.description")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>{$$("components.video.create.sources")}</FormLabel>
              <Grid
                templateColumns={["repeat(2, 1fr)", "repeat(3, 1fr)"]}
                gap={4}
                mb={4}
              >
                {sources.map((source) => {
                  return (
                    <Tag>
                      <TagLabel>{source}</TagLabel>
                      <TagCloseButton
                        onClick={() => {
                          setSources(sources.filter((s) => s !== source));
                        }}
                      />
                    </Tag>
                  );
                })}
              </Grid>
              <InputGroup>
                <Input
                  type={"text"}
                  placeholder={"https://www.youtube.com/watch?v=MakGA7Y77YI"}
                  id={"cv-ns"}
                />
                <InputRightAddon>
                  <IconButton
                    aria-label={$$("components.video.create.sources.add")}
                    icon={<FaPlus />}
                    variant={"ghost"}
                    onClick={() => {
                      const source = document.getElementById(
                        "cv-ns",
                      ) as HTMLInputElement;

                      setSources([...sources, source.value]);
                      source.value = "";
                    }}
                  />
                </InputRightAddon>
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>{$$("components.video.create.categories")}</FormLabel>
              <Stack gap={4}>
                {categories.map((c) => {
                  return (
                    <>
                      <IonItem color={"light"}>
                        <IonToggle
                          slot={"end"}
                          checked={selectedCategories.includes(c._id)}
                          onIonChange={(ev) => {
                            if (ev.detail.checked) {
                              setSelectedCategories([
                                ...selectedCategories,
                                c._id,
                              ]);
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
            </FormControl>
            <Button color={"brand.500"} leftIcon={<FaPlus />} type={"submit"}>
              {$$("components.video.create.button")}
            </Button>
          </Stack>
        </form>
      </SaveWorldModal>
    </>
  );
}
