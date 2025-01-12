"use client";

import React, { createContext, useContext, useState } from "react";

interface Edge {
  source: number;
  target: number;
  weight: number;
}

interface GraphContextType {
  algorithmResult: any;
  setAlgorithmResult: (result: any) => void;
  algorithmResultDijkstra: any;
  setAlgorithmResultDijkstra: (result: any) => void;
  algorithmResultBrute: any;
   setAlgorithmResultBrute: (result: any) => void
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  vertexCount: number;
  setVertexCount: (count: number) => void;
}

// Tạo context với giá trị mặc định
const GraphContext = createContext<GraphContextType | undefined>(undefined);

// Custom hook để sử dụng context
export function useGraph() {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error("useGraph must be used within a GraphProvider");
  }
  return context;
}

// Provider component
export function GraphProvider({ children }: { children: React.ReactNode }) {
  const [algorithmResult, setAlgorithmResult] = useState<any>(null);
  const [algorithmResultDijkstra, setAlgorithmResultDijkstra] = useState<any>(null);
  const [algorithmResultBrute, setAlgorithmResultBrute] = useState<any>(null)
  const [edges, setEdges] = useState<Edge[]>([]);
  const [vertexCount, setVertexCount] = useState<number>(0);

  const value = {
    algorithmResult,
    setAlgorithmResult,
    algorithmResultDijkstra,
    setAlgorithmResultDijkstra,
    algorithmResultBrute,
    setAlgorithmResultBrute,
    edges,
    setEdges,
    vertexCount,
    setVertexCount,
  };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
}
