/**
 * mobile/src/pages/learn/LearnGraph.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.03.2024
 *
 */

import * as React from "react";
import { useParams } from "react-router";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlowInstance,
} from "reactflow";
import { useEffect, useMemo } from "react";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";
import { $$ } from "../../translations/i18n";
import VideoNode from "../../components/reactflow/VideoNode";
import QuizNode from "../../components/reactflow/QuizNode";
import ArticleNode from "../../components/reactflow/ArticleNode";
import Page from "../../components/Page";

export default function LearnGraph() {
  const { id } = useParams<{ id: string }>();

  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance | null>(
    null,
  );

  useEffect(() => {
    const savedNodes: Node[] = [];
    const savedEdges: Edge[] = [];

    REST.Content.learningGraph(id).then((res) => {
      if (res.status === 200) {
        let p = res.payload.learningGraph;
        if (p.json && p.json !== "") {
          const saved = JSON.parse(p.json);
          savedNodes.push(...saved.nodes);
          savedEdges.push(...saved.edges);
        }

        setNodes(savedNodes);
        setEdges(savedEdges);
      } else {
        PopupManager.alert({
          title: $$("control.error"),
          description: $$("components.learning.graphs.error.loading"),
        });
      }
    });
  }, [id]);

  const nodeTypes = useMemo(() => {
    return {
      video: VideoNode,
      quiz: QuizNode,
      article: ArticleNode,
    };
  }, []);
  return (
    <>
      <Page title={$$("components.learning.graphs")}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          elementsSelectable={false}
          snapToGrid={true}
          snapGrid={[10, 10]}
          zoomOnPinch
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          onInit={setRfInstance}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </Page>
    </>
  );
}
