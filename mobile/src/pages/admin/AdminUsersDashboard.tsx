/**
 * /AdminUsersDashboard.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 19.08.2023
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { useState } from "react";
import { reloadCircle, reloadCircleSharp } from "ionicons/icons";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";
import { Grid, useDisclosure } from "@chakra-ui/react";
import MobileBox from "../../components/MobileBox";
import AdminUserEditorModal from "../../components/AdminUserEditorModal";
import { __ } from "../../translations/i18n";

export default function AdminUsersDashboard() {
  useRedirectForAnon({
    onlyAdmins: true,
  });

  const [users, setUsers] = useState<
    {
      _id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      createdAt: string;
      password: string;
      updatedAt: string;
      totpSecret: string;
      active: boolean;
      role: string;
      activationToken: string;
    }[]
  >([]);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  React.useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    const res = await REST.Admin.users(localStorage.getItem("token") as string);
    if (res.status === 200) {
      setUsers(res.payload.users);
    } else {
      PopupManager.alert({
        title: __("control.error"),
        description: __("pages.admin.users.loading.error", res.payload.error),
      });
    }
    setLoading(false);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentUser, setCurrentUser] = React.useState<{
    _id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    password: string;
    updatedAt: string;
    totpSecret: string;
    active: boolean;
    role: string;
    activationToken: string;
  }>({
    _id: "",
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    createdAt: "",
    password: "",
    updatedAt: "",
    totpSecret: "",
    active: false,
    role: "",
    activationToken: "",
  });

  return (
    <>
      <Page title={__("user.user")} redGradient>
        {loading && (
          <>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "50vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonSpinner />
            </div>
          </>
        )}
        {!loading && (
          <>
            <MobileBox bg={"#101010"}>
              <IonRefresher
                slot={"fixed"}
                onIonRefresh={async (ev) => {
                  await reload();
                  ev.detail.complete();
                }}
              >
                <IonRefresherContent></IonRefresherContent>
              </IonRefresher>
              <IonSearchbar
                placeholder={__("control.search")}
                value={query}
                onIonInput={(e) => {
                  setQuery((e.target as any).value);
                }}
              />
              <Grid
                templateColumns={[
                  "repeat(1, 1fr)",
                  "repeat(2, 1fr)",
                  "repeat(3, 1fr)",
                ]}
              >
                {users
                  .filter((user) => {
                    if (query === "") {
                      return true;
                    }
                    return (
                      user.username
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      user.email.toLowerCase().includes(query.toLowerCase()) ||
                      user.firstName
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      user.lastName.toLowerCase().includes(query.toLowerCase())
                    );
                  })
                  .map((user) => {
                    return (
                      <>
                        <IonCard
                          onClick={() => {
                            setCurrentUser(user);
                            onOpen();
                          }}
                        >
                          <IonCardHeader>
                            <IonCardTitle>
                              {user.firstName} {user.lastName}
                            </IonCardTitle>
                            <IonCardSubtitle>
                              <IonText
                                color={user.role === "admin" ? "danger" : ""}
                              >
                                {user.role === "admin"
                                  ? __("user.role.admin")
                                  : __("user.user")}
                              </IonText>
                              &nbsp;-&nbsp;
                              <IonText
                                color={user.active ? "success" : "danger"}
                              >
                                {user.active
                                  ? __("general.active")
                                  : __("general.inactive")}
                              </IonText>
                            </IonCardSubtitle>
                          </IonCardHeader>
                          <IonCardContent>
                            <IonText>
                              {user.username} - {user.email}
                            </IonText>
                            <br />
                            <IonText>
                              2FA:&nbsp;
                              <IonText
                                color={!user.totpSecret ? "danger" : "success"}
                              >
                                {!user.totpSecret
                                  ? __("general.deactivated")
                                  : __("general.activated")}
                              </IonText>
                            </IonText>
                            <br />
                            <IonText>
                              {__("pages.admin.users.created.at")}:&nbsp;
                              {new Date(user.createdAt).toLocaleString()}
                            </IonText>
                          </IonCardContent>
                        </IonCard>
                      </>
                    );
                  })}
              </Grid>
            </MobileBox>
          </>
        )}
        <AdminUserEditorModal
          user={currentUser}
          isOpen={isOpen}
          onClose={onClose}
          reload={reload}
        />
      </Page>
    </>
  );
}
