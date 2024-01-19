/**
 * mobile/src/pages/recipes/Recipes.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 06.12.2023
 *
 */

import * as React from "react";
import Page from "../../components/Page";
import MobileBox from "../../components/MobileBox";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import E2ProjectEditDetails from "../../components/E2ProjectEditDetails";
import E2ProjectEditHomepage from "../../components/E2ProjectEditHomepage";
import E2ProjectEditMembers from "../../components/E2ProjectEditMembers";
import AllRecipes from "../../components/AllRecipes";
import MyRecipes from "../../components/MyRecipes";
import { IonFab, IonFabButton } from "@ionic/react";
import { FaPlus } from "react-icons/fa6";
import { $$ } from "../../translations/i18n";

export default function Recipes() {
  return (
    <>
      <Page title={$$("menu.recipes")}>
        <MobileBox padding={"4"}>
          <Tabs colorScheme={"brand"} size={"md"} isFitted>
            <TabList maxW={"100%"} overflow={"auto"} overflowY={"hidden"}>
              <Tab>{$$("pages.recipes.my")}</Tab>
              <Tab>{$$("pages.recipes.explore")}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel
                style={{
                  padding: 0,
                }}
              >
                <MyRecipes />
              </TabPanel>
              <TabPanel
                style={{
                  padding: 0,
                }}
              >
                <AllRecipes />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MobileBox>
        <IonFab vertical={"bottom"} horizontal={"end"} slot={"fixed"}>
          <IonFabButton routerLink={"/recipes/create"} color={"success"}>
            <FaPlus
              style={{
                fontSize: "1.5rem",
              }}
            />
          </IonFabButton>
        </IonFab>
      </Page>
    </>
  );
}
