/**
 * backend2/src/util/permissions.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 10.03.2024
 *
 */
import { FastifyReply } from "fastify";
import { Perms } from "./Perms";

const DEFAULT_PERMISSIONS = {
  user: [Perms.AI_SINGLE_REQUEST, Perms.AI_CHAT_REQUEST],
};

export function getAllPermissions(role: string): {
  permission: string;
  allowed: boolean;
}[] {
  let permissions: {
    permission: string;
    allowed: boolean;
  }[] = [];

  const base_role = role.split(";")[0];

  if (base_role === "admin") {
    permissions = [
      {
        permission: "ALL",
        allowed: true,
      },
    ];
  }

  if (!role.includes(";"))
    return (
      DEFAULT_PERMISSIONS[base_role].map((x) => {
        return {
          permission: x,
          allowed: true,
        };
      }) || []
    );

  const list = role.split(";")[1].split(",");

  for (const item of list) {
    if (item.startsWith("+")) {
      permissions.push({
        permission: item.replace("+", ""),
        allowed: true,
      });
    } else if (item.startsWith("-")) {
      permissions.push({
        permission: item.replace("-", ""),
        allowed: false,
      });
    } else {
      permissions.push({
        permission: item,
        allowed: true,
      });
    }
  }

  if (DEFAULT_PERMISSIONS[base_role]) {
    for (const p of DEFAULT_PERMISSIONS[base_role]) {
      if (!permissions.find((x) => x.permission === p)) {
        permissions.push({
          permission: p,
          allowed: true,
        });
      }
    }
  }

  return permissions;
}

export function isAllowed(role: string, permission: string): boolean {
  if (role === "admin") return true;

  const perms = getAllPermissions(role);

  console.table(perms);

  for (const perm of perms) {
    if (perm.permission === permission) {
      return perm.allowed;
    }
  }

  return false;
}

export function allow(role: string, permission: string): string {
  // changes the role respecting the permission
  const perms = getAllPermissions(role);

  for (const perm of perms) {
    if (perm.permission === permission) {
      if (perm.allowed) {
        return role;
      } else {
        return role.replace(`-${permission}`, `+${permission}`);
      }
    }
  }

  return role;
}

export function disallow(role: string, permission: string): string {
  // changes the role respecting the permission
  const perms = getAllPermissions(role);

  for (const perm of perms) {
    if (perm.permission === permission) {
      if (!perm.allowed) {
        return role;
      } else {
        return role.replace(`+${permission}`, `-${permission}`);
      }
    }
  }

  return role;
}

export function checkRequestPermission(
  role: string,
  permission: string,
  res: FastifyReply,
) {
  if (!isAllowed(role, permission)) {
    res.status(403).send({
      error: "Permission denied",
    });
    return false;
  }

  return true;
}
