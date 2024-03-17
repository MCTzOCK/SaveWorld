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
import { Heading, Switch, Text, VStack } from "@chakra-ui/react";
import { $$ } from "../translations/i18n";

export default function TeachersClassPermissions(props: { classId: string }) {
  const [perms, setPerms] = React.useState<
    {
      permission: string;
      allowed: boolean;
    }[]
  >([]);
  const [categories, setCategories] = React.useState<string[]>([]);

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

    let c: string[] = [];

    res.payload.permissions.forEach(
      (p: { permission: string; allowed: boolean }) => {
        const cat = p.permission.split(".")[0];
        if (!c.includes(cat)) {
          c.push(cat);
        }
      },
    );

    setCategories(c);
  };

  return (
    <>
      <VStack spacing={4}>
        {categories.map((cat) => {
          return (
            <>
              <Heading
                size={"md"}
                justifySelf={"flex-start"}
                alignSelf={"flex-start"}
              >
                {$$(`permissions.cat.${cat}` as any) || cat}
              </Heading>
              {perms
                .filter((p) => p.permission.split(".")[0] === cat)
                .map((p, i) => {
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
                      {$$(`permissions.${p.permission}` as any)}
                    </Switch>
                  );
                })}
            </>
          );
        })}
      </VStack>
    </>
  );
}
