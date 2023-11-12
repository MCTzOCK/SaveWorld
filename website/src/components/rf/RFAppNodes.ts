/**
 * website/src/components/rf/RFAppNodes.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.11.2023
 *
 */
import { Edge, Node, Position } from "reactflow";

export const RFAppNodes: Node<any, string | undefined>[] | undefined = [
  {
    id: "text-mobile-app",
    type: "textNode",
    data: {
      text: "Mobile App",
      target: false,
      source: false,
    },
    parentNode: "group-mobile",
    extent: "parent",
    position: { x: 25, y: 25 },
  },
  {
    id: "ionic",
    type: "pictureNode",
    data: {
      text: "Ionic",
      handles: [
        {
          type: "target",
          position: Position.Right,
          id: "t1",
        },
        {
          type: "source",
          position: Position.Bottom,
          id: "t2",
        },
      ],
      imgUrl: "https://www.svgrepo.com/show/353912/ionic-icon.svg",
    },
    parentNode: "group-mobile",
    extent: "parent",
    position: { x: 350, y: 25 },
  },
  {
    id: "js-rest-client",
    type: "pictureNode",
    data: {
      text: "REST-Client",
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
      imgUrl: "https://cdn.worldvectorlogo.com/logos/logo-javascript.svg",
    },
    parentNode: "group-mobile",
    extent: "parent",
    position: { x: 150, y: 250 },
  },
];
export const RFAppEdges: Edge<any>[] | undefined = [
  {
    id: "ionic-js-rest-client",
    source: "ionic",
    target: "js-rest-client",
    animated: true,
    label: "Data",
  },
  {
    id: "js-rest-client-express",
    source: "js-rest-client",
    target: "express",
    animated: true,
    label: "REST API",
  },
  {
    id: "ionic-nominatim",
    source: "ionic",
    target: "nominatim",
    targetHandle: "t2",
    animated: true,
    label: "Geo-Lookups",
  },
];
