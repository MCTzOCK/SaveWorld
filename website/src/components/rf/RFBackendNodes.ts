/**
 * website/src/components/rf/RFBackendNodes.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */
import { Edge, Node, Position } from "reactflow";

export const RFBackendNodes: Node<any, string | undefined>[] | undefined = [
  {
    id: "text-backend",
    type: "textNode",
    data: {
      text: "Backend",
      target: false,
      source: false,
    },
    parentNode: "group-backend",
    extent: "parent",
    position: { x: 25, y: 25 },
  },
  {
    id: "express",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/express-109.svg",
      text: "Backend",
      handles: [
        {
          type: "target",
          position: Position.Top,
          id: "t1",
        },
        {
          type: "source",
          position: Position.Bottom,
          id: "t2",
        },
      ],
    },
    parentNode: "group-backend",
    extent: "parent",
    position: { x: 350, y: 25 },
  },
  {
    id: "mongoose",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/mongoose-1.svg",
      text: "Mongoose",
      handles: [
        {
          type: "target",
          position: Position.Top,
          id: "t1",
        },
        {
          type: "source",
          position: Position.Bottom,
          id: "t2",
        },
      ],
    },
    parentNode: "group-backend",
    extent: "parent",
    position: { x: 300, y: 250 },
  },
  {
    id: "mongodb",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg",
      text: "MongoDB",
      handles: [
        {
          type: "target",
          position: Position.Top,
          id: "t1",
        },
      ],
    },
    parentNode: "group-backend",
    extent: "parent",
    position: { x: 300, y: 500 },
  },
  {
    id: "nominatim",
    type: "pictureNode",
    data: {
      imgUrl: "https://nominatim.openstreetmap.org/ui/theme/logo.png",
      text: "Nominatim",
      handles: [
        {
          type: "target",
          position: Position.Bottom,
          id: "t1",
        },
        {
          type: "target",
          position: Position.Top,
          id: "t2",
        },
      ],
    },

    position: { x: 1000, y: -200 },
  },
  {
    id: "minio",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/minio-1.svg",
      text: "MinIO",
      handles: [
        {
          type: "target",
          position: Position.Top,
          id: "t1",
        },
      ],
    },
    parentNode: "group-backend",
    extent: "parent",
    position: { x: 50, y: 250 },
  },
];
