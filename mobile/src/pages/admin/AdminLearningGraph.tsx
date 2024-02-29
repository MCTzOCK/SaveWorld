/**
 * mobile/src/pages/admin/AdminLearningGraph.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 29.02.2024
 *
 */

import * as React from "react";
import { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MarkerType,
  MiniMap,
  Node,
  NodeChange,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { useParams } from "react-router";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";
import { REST } from "@saveworld/api-js";
import PopupManager from "../../util/PopupManager";
import { Box } from "@chakra-ui/react";
import { IonFab, IonFabButton, IonFabList, IonIcon } from "@ionic/react";
import { FaFileLines, FaPlus, FaQuestion, FaVideo } from "react-icons/fa6";
import {
  add,
  addSharp,
  chatbox,
  chatboxSharp,
  fileTray,
  home,
  homeSharp,
  people,
  peopleSharp,
  person,
  personSharp,
} from "ionicons/icons";

export default function AdminLearningGraph() {
  useRedirectForAnon({
    onlyAdmins: true,
  });
  const { id } = useParams<{ id: string }>();

  React.useEffect(() => {}, []);

  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const [currentEdge, setCurrentEdge] = React.useState<Edge | null>(null);
  const [currentNode, setCurrentNode] = React.useState<Node | null>(null);

  const [lastEdgeId, setLastEdgeId] = React.useState<string>("");
  const [lastNodeId, setLastNodeId] = React.useState<string>("");

  const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance | null>(
    null,
  );

  useEffect(() => {
    setLastEdgeId("__rendered_" + currentEdge?.id ?? "");
  }, [currentEdge]);

  useEffect(() => {
    setLastNodeId("__rendered_" + currentNode?.id ?? "");
  }, [currentNode]);

  useEffect(() => {
    if (rfInstance) {
      const saved = rfInstance.toObject();

      REST.Admin.updateLearningGraph(
        localStorage.getItem("token") as string,
        JSON.stringify(saved) as any,
        id,
      );
    }
  }, [edges, nodes]);

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

  return (
    <>
      <Page title={$$("components.learning.graphs")}>
        <Box w={"100%"} h={"100%"}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            snapToGrid={true}
            snapGrid={[10, 10]}
            zoomOnPinch
            fitView
            fitViewOptions={{ padding: 0.2 }}
            onInit={setRfInstance}
            onEdgeClick={(e, edge) => {
              setCurrentEdge(edge);
              setCurrentNode(null);
            }}
            onNodeClick={(e, node) => {
              setCurrentNode(node);
              setCurrentEdge(null);
            }}
          >
            <Controls />
            <Background />
          </ReactFlow>
        </Box>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color={"success"}>
            <IonIcon ios={add} md={addSharp} />
          </IonFabButton>
          <IonFabList side={"top"}>
            <IonFabButton color={"success"}>
              <FaFileLines />
            </IonFabButton>
            <IonFabButton color={"success"}>
              <FaQuestion />
            </IonFabButton>
            <IonFabButton
              color={"success"}
              onClick={() => {
                setNodes([
                  ...nodes,
                  {
                    id: "new-node-" + Math.random(),
                    type: "text",
                    data: { label: "New Node" },
                    position: { x: 0, y: 0 },
                  },
                ]);
              }}
            >
              <FaVideo />
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </Page>
    </>
  );
}
