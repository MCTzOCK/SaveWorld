/**
 * website/src/components/rf/RFBackendNodes.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */
import { Edge, Node } from "reactflow";

export const RFBackendNodes: Node<any, string | undefined>[] | undefined = [
  {
    id: "0",
    type: "textNode",
    data: {
      text: "Backend",
      target: false,
      source: false,
    },
    parentNode: "A",
    extent: "parent",
    position: { x: 25, y: 25 },
  },
  {
    id: "1",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/express-109.svg",
      text: "Backend",
      target: true,
      source: true,
    },
    parentNode: "A",
    extent: "parent",
    position: { x: 350, y: 25 },
  },
  {
    id: "2",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/mongoose-1.svg",
      text: "Mongoose",
      target: true,
      source: true,
    },
    parentNode: "A",
    extent: "parent",
    position: { x: 450, y: 250 },
  },
  {
    id: "3",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg",
      text: "MongoDB",
      target: true,
      source: false,
    },
    parentNode: "A",
    extent: "parent",
    position: { x: 450, y: 500 },
  },
  {
    id: "4",
    type: "pictureNode",
    data: {
      imgUrl: "https://nominatim.openstreetmap.org/ui/theme/logo.png",
      text: "Nominatim",
      target: true,
      source: false,
    },
    parentNode: "A",
    extent: "parent",
    position: { x: 250, y: 250 },
  },
  {
    id: "5",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/minio-1.svg",
      text: "MinIO",
      target: true,
      source: false,
    },
    parentNode: "A",
    extent: "parent",
    position: { x: 50, y: 250 },
  },
  {
    id: "6",
    type: "pictureNode",
    data: {
      imgUrl: "https://cdn.worldvectorlogo.com/logos/onesignal.svg",
      text: "OneSignal",
      target: true,
      source: false,
    },
    parentNode: "A",
    extent: "parent",
    position: { x: 650, y: 250 },
  },
];

export const RFBackendEdges: Edge<any>[] | undefined = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    label: "Datastream",
  },
  {
    id: "e1-3",
    source: "1",
    target: "4",
    animated: true,
    label: "Geo Lookups",
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
    label: "Data",
  },
  {
    id: "e1-5",
    source: "1",
    target: "5",
    animated: true,
    label: "Objects",
  },
  {
    id: "e1-6",
    source: "1",
    target: "6",
    animated: true,
    label: "Push Notifications",
  },
];
