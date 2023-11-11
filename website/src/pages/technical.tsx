/**
 * website/src/pages/technical.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 11.11.2023
 *
 */

import * as React from "react";
import { Background, Controls, ReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import { useMemo } from "react";
import PictureNode from "@/components/rf/PictureNode";
import { RFBackendEdges, RFBackendNodes } from "@/components/rf/RFBackendNodes";
import TextNode from "@/components/rf/TextNode";
import { RFSYSEdges, RFSYSNodes } from "@/components/rf/RFSysNodes";

export default function Technical() {
  const nodeTypes = {
    pictureNode: PictureNode,
    textNode: TextNode,
  };

  return (
    <>
      <ReactFlow
        fitView
        nodes={[...(RFSYSNodes as []), ...(RFBackendNodes as [])]}
        edges={[...(RFSYSEdges as []), ...(RFBackendEdges as [])]}
        nodeTypes={nodeTypes}
        onNodesChange={() => {}}
        onEdgesChange={() => {}}
        onConnect={() => {}}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          backgroundColor: "#000",
        }}
      >
        <Background />
      </ReactFlow>
    </>
  );
}
