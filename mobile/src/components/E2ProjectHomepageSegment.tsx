/**
 * mobile/src/components/E2ProjectHomepageSegment.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import * as React from "react";
import { E2HomepageSegment } from "../util/types/E2HomepageSegment";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  FormControl,
  FormHelperText,
  Image,
  List,
  ListIcon,
  ListItem,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { FaLock, FaPen, FaSave, FaTimes } from "react-icons/fa";
import { FaLeaf, FaThumbtack, FaTrash } from "react-icons/fa6";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js";
import PopupManager from "../util/PopupManager";

export default function E2ProjectHomepageSegment(props: {
  segment: E2HomepageSegment;
  editable: boolean;
  reloadSegments?: () => void;
}) {
  const [newContent, setNewContent] = React.useState<string>("");

  useEffect(() => {
    setNewContent(props.segment.content);
  }, [props.segment]);

  return (
    <>
      <IonCard
        style={{
          marginInline: 0,
        }}
      >
        <IonCardHeader>
          <IonCardTitle
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              width: "100%",
              marginInline: 0,
              paddingInline: 0,
            }}
          >
            {props.segment.pinned && (
              <FaThumbtack color={"var(--ion-color-success)"} />
            )}
            {props.segment.title}
          </IonCardTitle>
          {props.segment.pinned && (
            <>
              <IonCardSubtitle>ANGEHEFTET</IonCardSubtitle>
            </>
          )}
        </IonCardHeader>
        <IonCardContent>
          {props.editable ? (
            <>
              {props.segment.type === "text" && (
                <>
                  <Textarea
                    value={newContent}
                    onInput={(e) => {
                      setNewContent(e.currentTarget.value);
                    }}
                    placeholder={"Text eingeben"}
                  />
                </>
              )}
              {props.segment.type === "list" && (
                <>
                  <FormControl>
                    <Textarea
                      value={newContent.replaceAll("\0", "\n\n")}
                      onInput={(e) => {
                        setNewContent(
                          e.currentTarget.value.replaceAll("\n\n", "\0"),
                        );
                      }}
                      placeholder={"Liste eingeben"}
                    />
                    <FormHelperText>
                      Trenne die Einträge mit zwei Zeilenumbruch
                    </FormHelperText>
                  </FormControl>
                </>
              )}
              <ButtonGroup w={"100%"} mt={4}>
                <Button
                  color={"saveworld_green.500"}
                  w={"100%"}
                  leftIcon={<FaSave />}
                  onClick={async () => {
                    const res = await REST.EcoProjects.updateHomepageSegment(
                      localStorage.getItem("token") as string,
                      props.segment._id,
                      props.segment.project,
                      props.segment.title,
                      newContent,
                      props.segment.type,
                      props.segment.pinned,
                    );

                    if (res.status === 200) {
                      props.reloadSegments!();
                    } else {
                      await PopupManager.alert({
                        title: "Fehler",
                        description:
                          "Segment konnte nicht gespeichert werden: " +
                          res.payload.error,
                      });
                    }
                  }}
                >
                  Speichern
                </Button>
                <Button
                  color={"var(--ion-color-danger)"}
                  w={"100%"}
                  leftIcon={<FaTrash />}
                  onClick={async () => {
                    if (
                      !(await PopupManager.confirmAsync({
                        title: "Löschen",
                        question: "Willst du dieses Segment wirklich löschen?",
                      }))
                    )
                      return;

                    const res = await REST.EcoProjects.deleteHomepageSegment(
                      localStorage.getItem("token") as string,
                      props.segment._id,
                      props.segment.project,
                    );

                    if (res.status === 200) {
                      props.reloadSegments!();
                    } else {
                      await PopupManager.alert({
                        title: "Fehler",
                        description:
                          "Segment konnte nicht gelöscht werden: " +
                          res.payload.error,
                      });
                    }
                  }}
                >
                  Löschen
                </Button>
              </ButtonGroup>
              <Button
                color={
                  props.segment.pinned
                    ? "var(--ion-color-danger)"
                    : "saveworld_green.500"
                }
                w={"100%"}
                leftIcon={props.segment.pinned ? <FaTimes /> : <FaThumbtack />}
                mt={4}
                onClick={async () => {
                  const res = await REST.EcoProjects.updateHomepageSegment(
                    localStorage.getItem("token") as string,
                    props.segment._id,
                    props.segment.project,
                    props.segment.title,
                    props.segment.content,
                    props.segment.type,
                    !props.segment.pinned,
                  );

                  if (res.status === 200) {
                    props.reloadSegments!();
                  } else {
                    await PopupManager.alert({
                      title: "Fehler",
                      description:
                        "Segment konnte nicht angeheftet werden: " +
                        res.payload.error,
                    });
                  }
                }}
              >
                {props.segment.pinned ? "Ablösen" : "Anheften"}
              </Button>
            </>
          ) : (
            <>
              {props.segment.type === "text" && (
                <Text>{props.segment.content}</Text>
              )}
              {props.segment.type === "image" && (
                <>
                  <Image
                    src={props.segment.content.split("\0").pop() as string}
                    w={"100%"}
                    rounded={"md"}
                  />
                  <Text>{props.segment.content.split("\0")[0]}</Text>
                </>
              )}
              {props.segment.type === "list" && (
                <>
                  <List>
                    {props.segment.content.split("\0").map((item, index) => {
                      return (
                        <ListItem key={item}>
                          <ListIcon
                            as={FaLeaf}
                            color={"var(--ion-color-success)"}
                          />
                          {item}
                        </ListItem>
                      );
                    })}
                  </List>
                </>
              )}
            </>
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
}
