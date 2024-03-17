/**
 * mobile/src/components/E2ProjectEditHomepage.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

import * as React from "react";
import { E2Project } from "../util/types/E2Project";
import { useEffect, useState } from "react";
import { E2HomepageSegments } from "../util/types/E2HomepageSegment";
import { REST } from "@saveworld/api-js/index";
import PopupManager from "../util/PopupManager";
import { Button } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import E2ProjectHomepageSegment from "./E2ProjectHomepageSegment";
import { $$ } from "../translations/i18n";

export default function E2ProjectEditHomepage(props: { project: E2Project }) {
  const [segments, setSegments] = useState<E2HomepageSegments>([]);

  useEffect(() => {
    reloadSegments();
  }, [props.project]);

  const reloadSegments = async () => {
    const res = await REST.EcoProjects.homepage(
      localStorage.getItem("token") as string,
      props.project._id,
    );

    if (res.status !== 200) {
      await PopupManager.alert({
        title: $$("control.error"),
        description: $$(
          "pages.e2projects.homepage.loading.error",
          res.payload.error,
        ),
      });
    } else {
      setSegments(res.payload.segments);
    }
  };

  return (
    <>
      <Button
        color={"brand.500"}
        w={"100%"}
        leftIcon={<FaPlus />}
        onClick={async () => {
          const typePrompt = await PopupManager.selectAsync({
            title: $$("components.e2projects.homepage.segments.new"),
            helperText: $$(
              "components.e2projects.homepage.segments.new.choose",
            ),
            choices: [
              $$("components.e2projects.homepage.segments.new.text"),
              $$("components.e2projects.homepage.segments.new.list"),
            ],
          });

          if (!typePrompt) return;

          const type =
            typePrompt === "Text"
              ? "text"
              : typePrompt === "Liste"
              ? "list"
              : "image";

          const title = await PopupManager.promptAsync({
            title: $$("components.e2projects.homepage.segments.new"),
            helperText: $$(
              "components.e2projects.homepage.segments.new.enter.title",
            ),
            inputType: "INPUT",
          });

          if (!title) return;

          let content =
            type === "text"
              ? $$("components.e2projects.homepage.segments.new")
              : type === "list"
              ? $$("components.e2projects.homepage.segments.new.default.list")
              : $$("components.e2projects.homepage.segments.new.default");

          const res = await REST.EcoProjects.createHomepageSegment(
            localStorage.getItem("token") as string,
            props.project._id,
            title,
            content,
            type,
            false,
          );

          if (res.status !== 200) {
            await PopupManager.alert({
              title: $$("control.error"),
              description: $$(
                "components.e2projects.homepage.segments.new.error",
                res.payload.error,
              ),
            });
          }

          await reloadSegments();
        }}
      >
        {$$("components.e2projects.homepage.segments.new")}
      </Button>
      {segments
        .sort((a, b) => {
          return a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1;
        })
        .map((segment) => {
          return (
            <>
              <E2ProjectHomepageSegment
                segment={segment}
                editable={true}
                reloadSegments={reloadSegments}
              />
            </>
          );
        })}
    </>
  );
}
