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
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React from "react";
import { useGraph } from "@/context/GraphContext";
import CircleNode from "./CircleNode";
import TreeNode from "./TreeNode";
import FloatingEdge from "./FloatingEdge";
import dagre from "@dagrejs/dagre";
import * as d3 from "d3-force";

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
    algorithmResultFloyd,
    algorithmResultBrute,
    algorithmResultBranchAndBound,
    isDirected,
    source,
    target,
    setSource,
    setTarget,
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
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = React.useCallback(
    (changes) => setEdges((nds) => applyEdgeChanges(changes, nds)),
    [setEdges]
  );

  // const onConnect: OnConnect = React.useCallback(
  //   (connection) => {
  //     console.log("Kết nối mới:", connection);
  //     setEdges((eds) => addEdge(connection, eds));
  //   },
  //   [setEdges]
  // );

  // Vẽ đồ thị ban đầu khi có dữ liệu edges mới
  // React.useEffect(() => {
  //   if (graphEdges && graphEdges.length > 0) {
  //     const centerX = 500; // Tâm đồ thị
  //     const centerY = 400;
  //     const baseRadius = 150; // Bán kính cơ bản
  //     const spacing = 15; // Khoảng cách tăng thêm khi nhiều nodes
  //     const dynamicRadius = baseRadius + vertexCount * spacing; // Điều chỉnh bán kính theo số lượng nodes
  //     // Tạo nodes cho tất cả các đỉnh
  //     const newNodes = Array.from({ length: vertexCount }, (_, i) => ({
  //       id: `${i}`,
  //       type: "circle",
  //       // Sắp xếp nodes theo hình tròn
  //       position: {
  //         x:
  //           centerX + dynamicRadius * Math.cos((2 * Math.PI * i) / vertexCount),
  //         y:
  //           centerY + dynamicRadius * Math.sin((2 * Math.PI * i) / vertexCount),
  //       },
  //       data: { label: `${i}` },
  //       draggable: true,
  //     }));

  //     // Tạo edges với style mặc định
  //     const newEdges = graphEdges.map((edge) => ({
  //       id: `${edge.source}-${edge.target}`,
  //       source: `${edge.source}`,
  //       target: `${edge.target}`,
  //       label: `${edge.weight}`,
  //       type: "smoothstep",
  //       style: { stroke: "#666", strokeWidth: 3 },
  //       labelStyle: { fill: "#000", fontSize: 20 },
  //       markerEnd: !isDirected
  //         ? null
  //         : {
  //             type: "arrow",
  //             width: 20,
  //             height: 20,
  //             color: "#666",
  //           },
  //     }));
  //     console.log(newEdges, newEdges);

  //     setNodes(newNodes);
  //     setEdges(newEdges);
  //   }
  // }, [graphEdges, vertexCount]);

  React.useEffect(() => {
    if (graphEdges && graphEdges.length > 0) {
      const minDistance = 120; // Khoảng cách tối thiểu giữa các node
      const newNodes = [];

      function getRandomPosition() {
        let x, y;
        let attempts = 0;
        do {
          x = Math.random() * 800 + 100; // Giới hạn vị trí random
          y = Math.random() * 600 + 100;
          attempts++;
        } while (
          newNodes.some(
            (node) =>
              Math.hypot(node.position.x - x, node.position.y - y) < minDistance
          ) &&
          attempts < 50
        );
        return { x, y };
      }

      for (let i = 0; i < vertexCount; i++) {
        newNodes.push({
          id: `${i}`,
          type: "circle",
          position: getRandomPosition(),
          data: { label: `${i}` },
          draggable: true,
          style: {
            background: "#fff",
            color: "black",
            borderRadius: "50%",
          },
        });
      }

      // Tạo nodes theo dạng lưới
      // const cols = Math.ceil(Math.sqrt(vertexCount)); // Tính số cột
      // const spacing = 150; // Khoảng cách giữa các node
      // const newNodes = Array.from({ length: vertexCount }, (_, i) => ({
      //   id: `${i}`,
      //   type: "circle",
      //   position: {
      //     x: (i % cols) * spacing + 100, // Xếp theo cột
      //     y: Math.floor(i / cols) * spacing + 100, // Xếp theo hàng
      //   },
      //   data: { label: `${i}` },
      //   draggable: true,
      // }));

      const newEdges = graphEdges.map((edge) => ({
        id: `${edge.source}-${edge.target}`,
        source: `${edge.source}`,
        target: `${edge.target}`,
        label: `${edge.weight}`,
        type: "straight",
        style: { stroke: "#666", strokeWidth: 3 },
        labelStyle: { fill: "#000", fontSize: 20 },
        markerEnd: !isDirected
          ? null
          : {
              type: "arrow",
              width: 20,
              height: 20,
              color: "#666",
            },
      }));

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
            style: { stroke: "red", strokeWidth: 3 },
            labelStyle: { fill: "#2563eb", fontSize: 20 },
            markerEnd: {
              ...edge.markerEnd,
              color: "red",
            },
          };
        }
        return edge;
      });

      // Cập nhật màu sắc của nodes
      const updatedNodes = nodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          background:
            node.id === String(source)
              ? "green"
              : node.id === String(target)
              ? "red "
              : "white",
          color:
            node.id === String(source) || node.id === String(target)
              ? "white"
              : "black",
        },
      }));

      setEdges(updatedEdges);
      setNodes(updatedNodes);
      // setSource(null)
      // setTarget(null)
    }
  }, [algorithmResult, source, target]);

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
            style: { stroke: "red", strokeWidth: 3 },
            labelStyle: { fill: "#2563eb", fontSize: 20 },
            markerEnd: {
              ...edge.markerEnd,
              color: "red",
            },
          };
        }
        return edge;
      });

      // Cập nhật màu sắc của nodes
      const updatedNodes = nodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          background:
            node.id === String(source)
              ? "green "
              : node.id === String(target)
              ? "red "
              : "white",
          color:
            node.id === String(source) || node.id === String(target)
              ? "white"
              : "black",
        },
      }));

      setEdges(updatedEdges);
      setNodes(updatedNodes);
      console.log(nodes, edges);
    }
  }, [algorithmResultDijkstra, source, target]);

  // React.useEffect(
  //   () => {
  //     if (algorithmResultFloyd && edges.length > 0) {
  //       const { trace, graph } = algorithmResultFloyd;
  //       console.log(">>>>>>>>>>>>>", trace);

  //       const edges = [];
  //       for (let target = 0; target < trace[source].length; target++) {
  //         if (trace[source][target] !== -1 && source !== target) {
  //           edges.push(
  //             buildEdge(
  //               trace[source][target], // Predecessor of the target
  //               target, // Target node
  //               String(graph[trace[source][target]][target]), // Weight of the edge
  //               true, // Directed flag
  //               "green" // Color
  //             )
  //           );
  //         }
  //       }
  //       console.log(edges);
  //       return edges;
  //       // const updatedEdges = edges.map((edge) => {
  //       //   const isInDijkstra = algorithmResultDijkstra.path.some(
  //       //     (dijkstraEdge) =>
  //       //       `${dijkstraEdge.source}-${dijkstraEdge.target}` === edge.id ||
  //       //       `${dijkstraEdge.target}-${dijkstraEdge.source}` === edge.id
  //       //   );

  //       //   if (isInDijkstra) {
  //       //     return {
  //       //       ...edge,
  //       //       style: { stroke: "red", strokeWidth: 3 },
  //       //       labelStyle: { fill: "#2563eb", fontSize: 20 },
  //       //       markerEnd: {
  //       //         ...edge.markerEnd,
  //       //         color: "red",
  //       //       },
  //       //     };
  //       //   }
  //       //   return edge;
  //       // });

  //       // Cập nhật màu sắc của nodes
  //       const updatedNodes = nodes.map((node) => ({
  //         ...node,
  //         style: {
  //           ...node.style,
  //           backgroundColor:
  //             node.id === String(source)
  //               ? "green !important"
  //               : node.id === String(target)
  //               ? "red !important"
  //               : "white",
  //           color:
  //             node.id === String(source) || node.id === String(target)
  //               ? "black"
  //               : "black",
  //         },
  //       }));

  //       setEdges(edges);
  //       setNodes(updatedNodes);
  //       console.log(nodes, edges);
  //     }
  //   },
  //   [algorithmResultFloyd],
  //   source
  // );

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
      const minCost = algorithmResultBranchAndBound.resultNodes.reduce(
        (acc, value) => {
          if (!value.isLeaf) return acc;
          return Math.min(acc, value.cost);
        },
        Infinity
      );

      const nodes = algorithmResultBranchAndBound.resultNodes.map(
        (value, i) => {
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
        }
      );

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
        // onConnect={onConnect}
        // edgesUpdatable={true}
        elementsSelectable={true}
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
