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

const DEFAULT_PERMISSIONS: {
  [key: string]: Perms[];
} = {
  user: [
    Perms.AI_SINGLE_REQUEST,
    Perms.AI_CHAT_REQUEST,
    Perms.COMMUNITY_SUGGESTED,
    Perms.COMMUNITY_SEARCH,
    Perms.COMMUNITY_FOLLOWING,
    Perms.COMMUNITY_COMMENT,
    Perms.COMMUNITY_CREATE_BLOG,
    Perms.COMMUNITY_DELETE_BLOG,
    Perms.COMMUNITY_LIKE,
    Perms.COMMUNITY_RECEIVE_BLOG,
    Perms.COMMUNITY_RECEIVE_PROFILE,
    Perms.COMMUNITY_FOLLOW,
    Perms.COMMUNITY_RECEIVE_PROFILE_BLOGS,
    Perms.CONTENT_VIDEOS_SUGGESTED,
    Perms.CONTENT_VIDEOS_HISTORY,
    Perms.CONTENT_VIDEOS_COMMENT,
    Perms.CONTENT_VIDEOS_COMMENTS,
    Perms.EATINGPLAN_GET,
    Perms.EATINGPLAN_CREATE,
    Perms.EATINGPLAN_UPDATE,
    Perms.EATINGPLAN_DELETE,
    Perms.E2PROJECTS_MY,
    Perms.E2PROJECTS_CREATE,
    Perms.E2PROJECTS_TOGGLE_MEMBER,
    Perms.E2PROJECTS_UPDATE,
    Perms.E2PROJECTS_DELETE,
    Perms.E2PROJECTS_TODO_LISTS,
    Perms.E2PROJECTS_TODO_LISTS_CREATE,
    Perms.E2PROJECTS_TODO_LIST_DELETE,
    Perms.E2PROJECTS_TODO_ITEMS,
    Perms.E2PROJECTS_TODO_ITEM_DELETE,
    Perms.E2PROJECTS_TODO_ITEM_CREATE,
    Perms.E2PROJECTS_TODO_ITEM_CHECK,
    Perms.E2PROJECTS_MEMBER_DELETE,
    Perms.E2PROJECTS_MEMBER_CHANGE_ROLE,
    Perms.GAMES_LEADERBOARD,
    Perms.LIFESTYLE_MY,
    Perms.LIFESTYLE_LEVEL,
    Perms.LIFESTYLE_SUBMIT,
    Perms.LIFESTYLE_UPDATE,
    Perms.LIFESTYLE_MY_WEEKLY,
    Perms.LIFESTYLE_MY_DAY,
    Perms.NOTIFICATIONS_MY,
    Perms.NOTIFICATIONS_READ,
    Perms.RECIPES_ALL,
    Perms.RECIPES_CREATE,
    Perms.RECIPES_DELETE,
    Perms.RECIPES_MY,
    Perms.RECIPES_RECEIVE,
    Perms.RECIPES_UPDATE,
    Perms.SCHOOL_CLASSES_RECEIVE,
    Perms.SCHOOL_CLASSES_CREATE,
    Perms.SCHOOL_CLASSES_UPDATE,
    Perms.SCHOOL_CLASSES_DELETE,
  ],
};

DEFAULT_PERMISSIONS.admin = DEFAULT_PERMISSIONS.user;

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
