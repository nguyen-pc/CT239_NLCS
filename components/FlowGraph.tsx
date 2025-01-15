"use client";

import {
  ReactFlow,
  Controls,
  Background,
  OnNodesChange,
  applyNodeChanges,
  MarkerType,
  OnEdgesChange,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React from "react";
import { useGraph } from "@/context/GraphContext";
import CircleNode from "./CircleNode";
import TreeNode from "./TreeNode";
import FloatingEdge from "./FloatingEdge";
import dagre from "@dagrejs/dagre";

// Định nghĩa nodeTypes
const nodeTypes = {
  circle: CircleNode,
  tree: TreeNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

export function FlowGraph() {
  const {
    edges: graphEdges,
    vertexCount,
    algorithmResult,
    algorithmResultDijkstra,
    algorithmResultBrute,
    algorithmResultBranchAndBound,
    isDirected
  } = useGraph();
  const [nodes, setNodes] = React.useState([]);
  const [edges, setEdges] = React.useState([]);

  const buildEdge = (
    source: number,
    target: number,
    label: string,
    isDirected: boolean,
    color: string = "black"
  ) => {
    return {
      id: `e:${source}-${target}`,
      source: String(source),
      target: String(target),
      weight: label,
      data: {
        label,
      },
      type: "floating",
      style: {
        strokeWidth: 2,
        stroke: color,
      },
      markerEnd: !isDirected
        ? null
        : {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: color,
          },
    };
  };

  // Xử lý sự kiện khi nodes thay đổi (kéo thả)
  const onNodesChange: OnNodesChange = React.useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = React.useCallback(
    (changes) => setEdges((nds) => applyEdgeChanges(changes, nds)),
    [setEdges]
  );

  
  // Vẽ đồ thị ban đầu khi có dữ liệu edges mới
  React.useEffect(() => {
    if (graphEdges && graphEdges.length > 0) {
      // Tạo nodes cho tất cả các đỉnh
      const newNodes = Array.from({ length: vertexCount }, (_, i) => ({
        id: `${i}`,
        type: "circle",
        // Sắp xếp nodes theo hình tròn
        position: {
          x: 300 + 200 * Math.cos((2 * Math.PI * i) / vertexCount),
          y: 300 + 200 * Math.sin((2 * Math.PI * i) / vertexCount),
        },
        data: { label: `${i}` },
        draggable: true,
      }));

      // Tạo edges với style mặc định
      const newEdges = graphEdges.map((edge) => ({
        id: `${edge.source}-${edge.target}`,
        source: `${edge.source}`,
        target: `${edge.target}`,
        label: `${edge.weight}`,
        type: "smoothstep",
        style: { stroke: "#666",strokeWidth: 3  },
        labelStyle: { fill: "#666" },
        markerEnd: !isDirected ? null :{
           type: "arrow",
          width: 20,
          height: 20,
          color: "#666",
        },
      }));
      console.log(newEdges, newEdges);

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [graphEdges, vertexCount]);

  // Cập nhật style khi có kết quả thuật toán
  React.useEffect(() => {
    if (algorithmResult && edges.length > 0) {
      const updatedEdges = edges.map((edge) => {
        const isInMST = algorithmResult.mst.some(
          (mstEdge) =>
            `${mstEdge.source}-${mstEdge.target}` === edge.id ||
            `${mstEdge.target}-${mstEdge.source}` === edge.id
        );

        if (isInMST) {
          return {
            ...edge,
            style: { stroke: "green", strokeWidth: 3 },
            labelStyle: { fill: "#2563eb" },
            markerEnd: {
              ...edge.markerEnd,
              color: "green",
            },
          };
        }
        return edge;
      });

      setEdges(updatedEdges);
    }
  }, [algorithmResult]);

  React.useEffect(() => {
    if (algorithmResultDijkstra && edges.length > 0) {
      const updatedEdges = edges.map((edge) => {
        const isInDijkstra = algorithmResultDijkstra.path.some(
          (dijkstraEdge) =>
            `${dijkstraEdge.source}-${dijkstraEdge.target}` === edge.id ||
            `${dijkstraEdge.target}-${dijkstraEdge.source}` === edge.id
        );

        if (isInDijkstra) {
          return {
            ...edge,
            style: { stroke: "green", strokeWidth: 3 },
            labelStyle: { fill: "#2563eb" },
            markerEnd: {
              ...edge.markerEnd,
              color: "green",
            },
          };
        }
        return edge;
      });

      setEdges(updatedEdges);
      console.log(nodes, edges);
    }
  }, [algorithmResultDijkstra]);

  React.useEffect(() => {
    if (algorithmResultBrute && edges.length > 0) {
      // const { nodes: resultNodes, edges: resultEdges } = tspBruteForce(mat);
      setEdges([]);
      setNodes([]);
      const minCost = algorithmResultBrute.resultNodes.reduce((acc, value) => {
        if (!value.isLeaf) return acc;
        return Math.min(acc, value.cost);
      }, Infinity);

      const nodes = algorithmResultBrute.resultNodes.map((value, i) => {
        const res = {
          id: String(value.id),
          type: "tree",
          data: {
            label: `TT: ${i + 1} | TGT: ${value.cost}`,
            path: value.isLeaf ? value.id : null,
            style: {
              backgroundColor: "#fff",
              width: 150,
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
            },
          },
          position: {
            x: 0,
            y: 0,
          },
        };

        if (value.isLeaf && value.cost === minCost) {
          res.data.style.backgroundColor = "green";
          res.data.style.color = "white";
        }
        return res;
      });

      const edges = algorithmResultBrute.resultEdges.map((value) => {
        return buildEdge(
          value.from,
          value.to,
          `${value.to[value.to.length - 1]} - [${value.cost}]`,
          true,
          "green"
        );
      });

      const direction = "LR";

      const isHorizontal = direction === "LR";
      dagreGraph.setGraph({ rankdir: direction });

      nodes.forEach((node: any) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      edges.forEach((edge: any) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      const newNodes = nodes.map((node: any) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode = {
          ...node,
          targetPosition: isHorizontal ? "left" : "top",
          sourcePosition: isHorizontal ? "right" : "bottom",
          position: {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
          },
        };

        return newNode;
      });

      setEdges(edges);
      setNodes(newNodes);
      console.log(edges, newNodes);
    }
  }, [algorithmResultBrute]);

  React.useEffect(() => {
    if (algorithmResultBranchAndBound && edges.length > 0) {
      setEdges([]);
      setNodes([]);
      const minCost = algorithmResultBranchAndBound.resultNodes.reduce((acc, value) => {
        if (!value.isLeaf) return acc;
        return Math.min(acc, value.cost);
      }, Infinity);

      const nodes = algorithmResultBranchAndBound.resultNodes.map((value, i) => {
        const res = {
          id: String(value.id),
          type: "tree",
          data: {
            label: `TT: ${i + 1} | TGT: ${value.cost}`,
            path: value.isLeaf ? value.id : null,
            bound: value.bound,
            style: {
              backgroundColor: "#ccc",
              width: 150,
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
            },
          },
          position: {
            x: 0,
            y: 0,
          },
        };

        if (value.isLeaf && value.cost === minCost) {
          res.data.style.backgroundColor = "green";
          res.data.style.color = "white";
        }
        if (value.pruned) {
          res.data.style.backgroundColor = "red";
          res.data.style.color = "white";
        }
        return res;
      });

      const edges = algorithmResultBranchAndBound.resultEdges.map((value) => {
        return buildEdge(
          value.from,
          value.to,
          `${value.to[value.to.length - 1]} - [${value.cost}]`,
          true,
          "green"
        );
      });

      const direction = "TB";

      const isHorizontal = direction === "TB";
      dagreGraph.setGraph({ rankdir: direction });

      nodes.forEach((node: any) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      edges.forEach((edge: any) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      const newNodes = nodes.map((node: any) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode = {
          ...node,
          targetPosition: isHorizontal ? "left" : "top",
          sourcePosition: isHorizontal ? "right" : "bottom",
          position: {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
          },
        };

        return newNode;
      });

      setEdges(edges);
      setNodes(newNodes);
      console.log(edges, newNodes);
    }
  }, [algorithmResultBranchAndBound]);
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultEdgeOptions={{
          style: { strokeWidth: 2 },
          // type: "smoothstep",
          markerEnd: {
            type: "arrow",
            width: 20,
            height: 20,
            color: "#666",
          },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default FlowGraph;
