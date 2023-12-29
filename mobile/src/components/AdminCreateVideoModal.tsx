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
import { REST } from "@saveworld/api-js";
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
        title={"Neues Video"}
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
                title: "Fehler",
                description: "Bitte wähle mindestens eine Kategorie aus.",
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
                title: "Fehler",
                description: "Bitte fülle alle Felder aus!",
              });
              return;
            }

            const data = new FormData();
            data.append("title", name);
            data.append("description", desc);
            data.append("categories", JSON.stringify(selectedCategories));
            data.append("sources", JSON.stringify(sources));
            data.append("youtubeVideoId", id);

            setUploading(true);

            const res = await fetch(ENDPOINT + "/admin/content/videos/create", {
              method: "POST",
              body: data,
              headers: {
                "X-AUTH": localStorage.getItem("token") as string,
              },
            });

            setUploading(false);
            setSelectedCategories([]);
            if (res.ok) {
              props.callback();
              props.onClose();
            } else {
              let x = await res.json();
              PopupManager.alert({
                title: "Fehler",
                description:
                  "Fehler beim Hochladen des Videos: " + x.payload.error,
              });
              props.onClose();
            }
          }}
        >
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>YouTube-ID</FormLabel>
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
              <FormLabel>Name</FormLabel>
              <InputGroup>
                <InputLeftAddon>
                  <FaPen />
                </InputLeftAddon>
                <Input
                  name={"name"}
                  type={"text"}
                  placeholder={"Neues Video"}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Beschreibung</FormLabel>
              <Textarea
                name={"description"}
                placeholder={"Das ist meine Videobeschreibung"}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Quellen</FormLabel>
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
                    aria-label={"Add Source"}
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
              <FormLabel>Kategorien</FormLabel>
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
              Video erstellen
            </Button>
          </Stack>
        </form>
      </SaveWorldModal>
    </>
  );
}
