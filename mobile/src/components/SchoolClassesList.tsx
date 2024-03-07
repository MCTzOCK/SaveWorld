/**
 * mobile/src/components/SchoolClassesList.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.03.2024
 *
 */

import * as React from "react";
import { Button, ButtonGroup, Flex, Grid, IconButton } from "@chakra-ui/react";
import { FaDeleteLeft, FaPlus, FaTrash } from "react-icons/fa6";
import { $$ } from "../translations/i18n";
import PopupManager from "../util/PopupManager";
import { REST } from "@saveworld/api-js/REST";
import { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { FaPen } from "react-icons/fa";

export default function SchoolClassesList() {
  const [classes, setClasses] = useState<
    {
      _id: string;
      createdAt: string;
      createdBy: string;
      students: string[];
      name: string;
    }[]
  >([]);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    const res = await REST.School.classes(
      localStorage.getItem("token") as string,
    );

    if (res.status !== 200) {
      await PopupManager.alertAsync({
        title: $$("control.error"),
        description: res.payload.error,
      });
      return;
    }

    setClasses(res.payload.schoolClasses);
  };

  const router = useIonRouter();

  return (
    <>
      <Flex w={"100%"} justifyContent={"flex-end"} mb={4}>
        <Button
          variant={"brand"}
          leftIcon={<FaPlus />}
          onClick={async () => {
            const name = await PopupManager.promptAsync({
              title: $$("pages.teachers.classes.create"),
              helperText: $$("pages.teachers.classes.create.name.desc"),
            });
            if (!name) return;

            const res = await REST.School.createClass(
              localStorage.getItem("token") as string,
              name,
            );

            if (res.status !== 200) {
              await PopupManager.alertAsync({
                title: $$("control.error"),
                description: res.payload.error,
              });
              return;
            }
            await reload();
          }}
        >
          {$$("pages.teachers.classes.create")}
        </Button>
      </Flex>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
        gap={2}
      >
        {classes.map((c, i) => (
          <Flex
            key={i}
            p={4}
            bg={"gray.800"}
            borderRadius={8}
            justifyContent={"space-between"}
            direction={"column"}
            gap={2}
          >
            <div>
              <strong>{c.name}</strong>
              <br />
              {c.students.length} {$$("pages.teachers.classes.students")}
            </div>
            <ButtonGroup>
              <Button
                variant={"brand"}
                w={"100%"}
                onClick={() => {
                  router.push("/teachers/classes/" + c._id, "forward", "push");
                }}
              >
                {$$("general.open")}
              </Button>
              <IconButton
                aria-label={"Delete"}
                icon={<FaTrash />}
                colorScheme={"red"}
                onClick={async () => {
                  if (
                    !(await PopupManager.confirmAsync({
                      title: $$("pages.teachers.classes.delete"),
                      question: $$("pages.teachers.classes.delete.desc"),
                    }))
                  )
                    return;

                  const res = await REST.School.deleteClass(
                    localStorage.getItem("token") as string,
                    c._id,
                  );

                  if (res.status !== 200) {
                    await PopupManager.alertAsync({
                      title: $$("control.error"),
                      description: res.payload.error,
                    });
                    return;
                  }

                  await reload();
                }}
              />
              <IconButton
                aria-label={"Rename"}
                icon={<FaPen />}
                colorScheme={"blue"}
                onClick={async () => {
                  const newName = await PopupManager.promptAsync({
                    title: $$("pages.teachers.classes.rename"),
                    helperText: $$("pages.teachers.classes.rename.desc"),
                  });

                  if (!newName) return;

                  const res = await REST.School.renameClass(
                    localStorage.getItem("token") as string,
                    c._id,
                    newName,
                  );

                  if (res.status !== 200) {
                    await PopupManager.alertAsync({
                      title: $$("control.error"),
                      description: res.payload.error,
                    });
                    return;
                  }

                  await reload();
                }}
              />
            </ButtonGroup>
          </Flex>
        ))}
      </Grid>
    </>
  );
}
