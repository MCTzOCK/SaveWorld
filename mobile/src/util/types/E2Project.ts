/**
 * mobile/src/util/types/E2Project.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

export type E2Project = {
  _id: string;
  owner: string;
  name: string;
  startDate: string;
  lastsDays: number;
  geoLocationType: "nominatim" | "custom";
  geoLocationDisplayName: string;
  geoLocationLat: string;
  geoLocationLon: string;
  users: {
    userId: string;
    username: string;
    permissions: "ADMINISTRATOR" | "EDITOR" | "MEMBER";
  }[];
  _v: number;
};

export type E2Projects = E2Project[];
