/**
 * mobile/src/types.d.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.12.2023
 *
 */
import PopupManager from "./util/PopupManager";

declare global {
  interface Window {
    PopupManager: typeof PopupManager;
  }
}

interface MCategory {
  name: string;
  description: string;
  image: string;
}

interface MChatMessage {
  content: string;
  readBy: string[];
  senderId: string;
  createdAt: string;
  chat: string;
}

interface MChat {
  users: string[];
  isGroup: boolean;
}

interface MCommunityBlogEntry {
  username: string;
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  comments: any[];
  createdAt: string;
}

interface MEatingPlan {
  user: string;
  recipes: MRecipe[];
  date: string;
}

interface MEcoAction {
  user: string;
  action: string;
  description: string;
  date: string;
}

interface MEcoProjectHomepageSegment {
  project: string;
  pinned: boolean;
  title: string;
  content: string;
  type: string;
}

interface MEcoProject {
  owner: string;
  name: string;
  startDate: string;
  lastsDays: number;
  users: {
    userId: string;
    username: string;
    permissions: string;
  }[];
  geoLocationType: string;
  geoLocationDisplayName: string;
  geoLocationLat: string;
  geoLocationLon: string;
}

interface MEcoProjectToDoList {
  project: string;
  title: string;
}

interface MEcoProjectToDoListItem {
  list: string;
  title: string;
  description: string;
  checked: boolean;
  checkedBy: string;
  checkedAt: string;
}

interface MLifestyle {
  user: string;
  actions: {
    template: string;
    currentPerWeek: number;
  }[];
  goals: {
    template: string;
    goalPerWeek: number;
  }[];
}

interface MLifestyleSummary {
  user: string;
  date: string;
  goals: {
    template: string;
    perDay: number;
  }[];
}

interface MLifestyleTemplate {
  name: string;
  goal: string;
}

interface MPushNotification {
  user: string;
  title: string;
  content: string;
  launch_url: string;
  read: boolean;
  createdAt: string;
}

interface MRecipe {
  _id: string;
  created_by: string;
  image: string;
  title: string;
  ingredients: string[];
  steps: string[];
}

interface MSupportRequest {
  email: string;
  category: string;
  additionalData: string;
  message: string;
  createdAt: string;
  processed: boolean;
}

interface MUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  active: boolean;
  role: string;
  createdAt: string;
  activationToken: string;
  totpSecret: string;
}

interface MUserPreferences {
  user: string;
  interests: string[];
  picture: string;
  community_profile: {
    picture: string;
    displayName: string;
    biography: string;
    banner: string;
    showLevel: boolean;
    location: string;
    level?: number;
    followers: string[];
  };
  blocked_users: string[];
  cookbookItems: string[];
}

interface MVideoComment {
  user: string;
  username: string;
  video: string;
  content: string;
  createdAt: string;
}

interface MVideo {
  title: string;
  streamUrl: string;
  thumbnailUrl: string;
  categories: string[];
  description: string;
  ratings: number[];
  sources: string[];
}

interface MWatchHistory {
  user: string;
  video: string;
  watchedAt: string;
}
