/**
 * mobile/src/util/files.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 22.12.2023
 *
 */
import { ENDPOINT } from "../env";
import { REST } from "@saveworld/api-js";
import PopupManager from "./PopupManager";

export const uploadImage = (
  callback: (url: string) => void,
  accept = "image/*",
) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = accept;

  fileInput.addEventListener("change", async (e) => {
    const file = (e.target as any).files[0];
    const formData = new FormData();
    formData.append("file", file);
    const mediaRes = await fetch(ENDPOINT + "/media/upload", {
      method: "POST",
      body: formData,
    });

    if (mediaRes.status === 200) {
      callback((await mediaRes.json()).data.url);
    } else {
      PopupManager.alert({
        title: "Fehler",
        description: "Fehler beim Upload: " + mediaRes.statusText,
      });
    }

    (
      document.querySelector("#manual-mount-point") as HTMLDivElement
    ).removeChild(fileInput);
  });

  fileInput.onchange = async (e) => {};
  (document.querySelector("#manual-mount-point") as HTMLDivElement).appendChild(
    fileInput,
  );
  fileInput.click();
};
