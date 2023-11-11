/**
 * website/src/components/rf/RFSysNodes.ts
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */
import { Edge, Node } from "reactflow";

export const RFSYSNodes: Node<any, string | undefined>[] | undefined = [
  {
    id: "A",
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
];

export const RFSYSEdges: Edge<any>[] | undefined = [];
