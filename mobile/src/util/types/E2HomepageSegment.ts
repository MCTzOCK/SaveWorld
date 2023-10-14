/**
 * mobile/src/util/types/E2HomepageSegment.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 14.10.2023
 *
 */

export type E2HomepageSegment = {
  _id: string;
  project: string;
  pinned: boolean;
  title: string;
  content: string;
  type: "text" | "image" | "list";
};

export type E2HomepageSegments = E2HomepageSegment[];
