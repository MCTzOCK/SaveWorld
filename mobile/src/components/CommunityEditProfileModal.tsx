/**
 * mobile/src/components/CommunityEditProfileModal.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.09.2023
 *
 */

import * as React from "react";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonSearchbar,
  IonText,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { REST } from "@saveworld/api-js/index";
import { informationCircle, informationCircleSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { ENDPOINT } from "../env";
import PopupManager from "../util/PopupManager";
import { $$ } from "../translations/i18n";

export default function CommunityEditProfileModal(props: {
  modal: React.RefObject<HTMLIonModalElement>;
  profile:
    | {
        picture: string;
        displayName: string;
        biography: string;
        banner: string;
        showLevel: boolean;
        location: string;
      }
    | undefined;
  reloadProfile: () => void;
}) {
  const [banner, setBanner] = useState<string>("");
  const [dp, setDP] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [loc, setLoc] = useState<string>("");
  const [showLevel, setShowLevel] = useState<boolean>(false);

  useEffect(() => {
    if (props.profile) {
      setBanner(props.profile.banner);
      setDP(props.profile.displayName);
      setBio(props.profile.biography);
      setLoc(props.profile.location);
      setShowLevel(props.profile.showLevel);
    }
  }, [props.profile]);

  return (
    <>
      <IonModal
        ref={props.modal}
        initialBreakpoint={0.7}
        breakpoints={[0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot={"start"}>
              <IonButton
                color={"danger"}
                onClick={() => {
                  props.modal.current?.dismiss();
                }}
              >
                {$$("control.cancel")}
              </IonButton>
            </IonButtons>
            <IonTitle>{$$("pages.community.profile.actions.edit")}</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton
                color={"success"}
                onClick={async () => {
                  const res = await REST.Account.updatePreferences(
                    localStorage.getItem("token") as string,
                    {
                      community_profile: {
                        displayName: dp,
                        biography: bio,
                        banner: banner,
                        showLevel: showLevel,
                        location: loc,
                      },
                    },
                  );
                  if (res.status === 200) {
                    props.reloadProfile();
                    props.modal.current?.dismiss();
                  } else {
                    PopupManager.alert({
                      title: $$("control.error"),
                      description: $$(
                        "components.forum.edit.profile.error",
                        "res.payload.error",
                      ),
                    });
                  }
                }}
              >
                <b>{$$("control.save")}</b>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {props.profile && (
            <>
              <div
                style={{
                  padding: "12px",
                }}
              >
                <IonButton
                  color={"success"}
                  expand={"block"}
                  onClick={async () => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";

                    fileInput.addEventListener("change", async (e) => {
                      const file = (e.target as any).files[0];
                      const formData = new FormData();
                      formData.append("file", file);
                      const mediaRes = await fetch(ENDPOINT + "/media/upload", {
                        method: "POST",
                        body: formData,
                      });

                      if (mediaRes.status === 200) {
                        setBanner((await mediaRes.json()).data.url);
                      } else {
                        PopupManager.alert({
                          title: $$("control.error"),
                          description: $$(
                            "control.upload.error",
                            mediaRes.statusText,
                          ),
                        });
                      }

                      (
                        document.querySelector(
                          "#manual-mount-point",
                        ) as HTMLDivElement
                      ).removeChild(fileInput);
                    });

                    fileInput.onchange = async (e) => {};
                    (
                      document.querySelector(
                        "#manual-mount-point",
                      ) as HTMLDivElement
                    ).appendChild(fileInput);
                    fileInput.click();
                  }}
                >
                  {$$("components.community.edit.banner")}
                </IonButton>
                <IonList inset>
                  <IonItem color={"light"}>
                    <IonInput
                      labelPlacement={"fixed"}
                      label={$$("components.community.edit.display.name")}
                      onIonInput={(ev) => {
                        setDP(ev.detail.value || "");
                      }}
                      value={dp}
                    />
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonInput
                      labelPlacement={"fixed"}
                      label={$$("pages.community.profile.no.location")}
                      onIonInput={(ev) => {
                        setLoc(ev.detail.value || "");
                      }}
                      value={loc}
                    />
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonTextarea
                      labelPlacement={"fixed"}
                      label={$$("components.community.edit.bio")}
                      autoGrow={true}
                      onIonInput={(ev) => {
                        setBio(ev.detail.value || "");
                      }}
                      value={bio}
                    />
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonToggle
                      labelPlacement={"fixed"}
                      checked={showLevel}
                      onIonChange={(ev) => {
                        setShowLevel(ev.detail.checked);
                      }}
                    >
                      <IonLabel>
                        {$$("components.community.edit.eco.level")}
                      </IonLabel>
                    </IonToggle>
                  </IonItem>
                </IonList>
              </div>
            </>
          )}
        </IonContent>
      </IonModal>
    </>
  );
}
