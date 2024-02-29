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
import { useCallback, useEffect, useMemo } from "react";
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
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
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
import VideoNode from "../../components/reactflow/VideoNode";

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

  const nodeTypes = useMemo(() => {
    return {
      video: VideoNode,
    };
  }, []);

  return (
    <>
      <Page title={$$("components.learning.graphs")}>
        <Flex
          w={"100%"}
          h={"100%"}
          gap={2}
          direction={["column", "column", "row"]}
        >
          <Box w={"100%"} flex={"80%"} h={"100%"}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              snapToGrid={true}
              snapGrid={[10, 10]}
              zoomOnPinch
              nodeTypes={nodeTypes}
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
          <Box
            flex={"20%"}
            bg={"gray.800"}
            rounded={"md"}
            shadow={"xl"}
            maxW={"20%"}
            p={4}
          >
            <Heading size={"lg"} textAlign={"center"}>
              {$$("components.learning.graphs.inspector")}
            </Heading>
            {currentEdge && (
              <>
                <Heading size={"md"} textAlign={"center"}>
                  {$$("components.learning.graphs.edge")}
                </Heading>
                <Stack gap={2}>
                  <HStack gap={4}>
                    <Text fontSize={"2xl"} fontWeight={700}>
                      {$$("components.learning.graphs.edge.animated")}
                    </Text>
                    <Select
                      defaultValue={currentEdge.animated ? "yes" : "no"}
                      onChange={() => {
                        currentEdge.animated = !currentEdge.animated;
                        setEdges([
                          ...edges.filter((e) => e.id !== currentEdge.id),
                          currentEdge,
                        ]);
                        setCurrentEdge(currentEdge);
                      }}
                    >
                      <option value={"no"}>{$$("control.no")}</option>
                      <option value={"yes"}>{$$("control.yes")}</option>
                    </Select>
                  </HStack>
                  <HStack gap={4}>
                    <Text fontSize={"2xl"} fontWeight={700}>
                      {$$("components.learning.graphs.edge.label")}
                    </Text>
                    <Input
                      defaultValue={currentEdge.label?.toString() || ""}
                      placeholder={$$("components.learning.graphs.edge.label")}
                      onChange={(e) => {
                        currentEdge.label = e.target.value;
                        setEdges([
                          ...edges.filter((e) => e.id !== currentEdge.id),
                          currentEdge,
                        ]);
                        setCurrentEdge(currentEdge);
                      }}
                    />
                  </HStack>
                  <Button
                    color={"red.500"}
                    onClick={() => {
                      setEdges(edges.filter((e) => e.id !== currentEdge.id));
                      setCurrentEdge(null);
                    }}
                  >
                    {$$("control.delete")}
                  </Button>
                </Stack>
              </>
            )}

            {currentNode && (
              <>
                <Heading size={"md"} textAlign={"center"}>
                  {$$("components.learning.graphs.node")}
                </Heading>
                <Stack>
                  <HStack gap={4}>
                    <Text fontSize={"2xl"} fontWeight={700}>
                      {$$("components.learning.graphs.node.type")}:&nbsp;
                      {currentNode.type}
                    </Text>
                  </HStack>
                  <Button
                    color={"red.500"}
                    onClick={() => {
                      setNodes(nodes.filter((n) => n.id !== currentNode.id));
                      setCurrentNode(null);
                    }}
                  >
                    {$$("control.delete")}
                  </Button>
                </Stack>
              </>
            )}
            {!currentEdge && !currentNode && (
              <>{$$("components.learning.graphs.inspector.nothing.selected")}</>
            )}
          </Box>
        </Flex>
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
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
                    type: "video",
                    data: {},
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
