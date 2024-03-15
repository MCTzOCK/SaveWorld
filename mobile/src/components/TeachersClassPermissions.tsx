/**
 * mobile/src/components/TeachersClassPermissions.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 15.03.2024
 *
 */

import * as React from "react";
import { useEffect } from "react";
import { REST } from "@saveworld/api-js/REST";
import { Switch, VStack } from "@chakra-ui/react";

export default function TeachersClassPermissions(props: { classId: string }) {
  const [perms, setPerms] = React.useState<
    {
      permission: string;
      allowed: boolean;
    }[]
  >([]);

  useEffect(() => {
    if (!props.classId) return;

    reload();
  }, [props.classId]);

  const reload = async () => {
    const res = await REST.School.permission(
      localStorage.getItem("token") as string,
      props.classId,
    );

    if (res.status !== 200) {
      return;
    }

    setPerms(res.payload.permissions);
  };

  return (
    <>
      <VStack spacing={4}>
        {perms.map((p, i) => {
          return (
            <Switch
              key={i}
              w={"100%"}
              isChecked={p.allowed}
              onChange={async () => {
                let newPerms = [...perms];

                newPerms = newPerms.map((np) => {
                  if (np.permission === p.permission) {
                    np.allowed = !np.allowed;
                  }

                  return np;
                });

                const res = await REST.School.updatePermission(
                  localStorage.getItem("token") as string,
                  props.classId,
                  newPerms,
                );

                if (res.status !== 200) {
                  return;
                }

                reload();
              }}
            >
              {p.permission}
            </Switch>
          );
        })}
      </VStack>
    </>
  );
}
