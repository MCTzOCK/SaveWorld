/**
 * website/src/components/rf/RFAppNodes.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 12.11.2023
 *
 */
import { Edge, Node } from "reactflow";

export const RFAppNodes: Node<any, string | undefined>[] | undefined = [
  {
    id: "00",
    type: "textNode",
    data: {
      text: "Mobile App",
      target: false,
      source: false,
    },
    parentNode: "B",
    extent: "parent",
    position: { x: 25, y: 25 },
  },
  {
    id: "01",
    type: "pictureNode",
    data: {
      text: "Ionic",
      target: false,
      source: true,
      imgUrl: "https://www.svgrepo.com/show/353912/ionic-icon.svg",
    },
    parentNode: "B",
    extent: "parent",
    position: { x: 350, y: 25 },
  },
  {
    id: "02",
    type: "pictureNode",
    data: {
      text: "REST-Client",
      target: true,
      source: true,
      imgUrl: "https://cdn.worldvectorlogo.com/logos/logo-javascript.svg",
    },
    parentNode: "B",
    extent: "parent",
    position: { x: 50, y: 300 },
  },
];
export const RFAppEdges: Edge<any>[] | undefined = [
  {
    id: "e01-02",
    source: "01",
    target: "02",
    animated: true,
    label: "Data",
  },
  {
    id: "e02-1",
    source: "02",
    target: "1",
    animated: true,
    label: "REST API",
  },
];
