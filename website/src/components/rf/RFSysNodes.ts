/**
 * website/src/components/rf/RFSysNodes.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */
import { Edge, Node, Position } from "reactflow";

export const RFSYSNodes: Node<any, string | undefined>[] | undefined = [
  {
    id: "group-backend",
    type: "group",
    data: {
      label: null,
    },
    position: { x: 0, y: 0 },
    style: {
      backgroundColor: "",
      width: 840,
      height: 700,
    },
  },
  {
    id: "group-mobile",
    type: "group",
    data: {
      label: null,
    },
    position: { x: 0, y: -750 },
    style: {
      backgroundColor: "",
      width: 840,
      height: 700,
    },
  },
  {
    id: "directus",
    type: "pictureNode",
    data: {
      imgUrl: "https://avatars.githubusercontent.com/u/15967950?s=200&v=4",
      text: "Directus",
      handles: [
        {
          type: "target",
          position: "top",
          id: "t1",
        },
      ],
    },
    position: {
      x: 600,
      y: -300,
    },
  },
  {
    id: "apple-maps",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/apple-13.svg",
      text: "Apple Maps",
      handles: [
        {
          type: "target",
          position: "top",
          id: "t1",
        },
      ],
    },
    position: {
      x: 400,
      y: -300,
    },
  },
  {
    id: "onesignal",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/onesignal.svg",
      text: "OneSignal",
      handles: [
        {
          type: "target",
          position: Position.Bottom,
          id: "t1",
        },
        {
          type: "source",
          position: Position.Top,
          id: "t2",
        },
      ],
    },
    position: { x: 1200, y: -200 },
  },
];

export const RFSYSEdges: Edge<any>[] | undefined = [
  {
    id: "ionic-directus",
    source: "ionic",
    target: "directus",
    animated: true,
    label: "Articles",
  },
  {
    id: "ionic-apple-maps",
    source: "ionic",
    target: "apple-maps",
    animated: true,
    label: "MapView",
  },
  {
    id: "express-mongoose",
    source: "express",
    target: "mongoose",
    animated: true,
    label: "Datastream",
  },
  {
    id: "express-nominatim",
    source: "express",
    target: "nominatim",
    animated: true,
    label: "Geo Lookups",
  },
  {
    id: "mongoose-mongodb",
    source: "mongoose",
    target: "mongodb",
    animated: true,
    label: "Data",
  },
  {
    id: "express-minio",
    source: "express",
    target: "minio",
    animated: true,
    label: "Objects",
  },
  {
    id: "express-onesignal",
    source: "express",
    target: "onesignal",
    animated: true,
    label: "Push Notifications",
  },
  {
    id: "onesignal-ionic",
    source: "onesignal",
    target: "ionic",
    animated: true,
    label: "Push Notifications",
  },
];
