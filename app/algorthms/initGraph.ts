interface Edge {
    source: number;
    target: number;
    weight: number;
}

export const initGraph = (
    edges: [number, number, number][],
    vertexCount: number
  ): {
    mst: Edge[];
    totalWeight: number;
    steps: Edge[][];
  } => {
    const steps: Edge[][] = [];
  
    // Chuyển đổi định dạng cạnh
    const formattedEdges: Edge[] = edges.map(([u, v, w]) => ({
      source: u,
      target: v,
      weight: w,
    }));
  
    // Sắp xếp các cạnh theo trọng số tăng dần
    formattedEdges.sort((a, b) => a.weight - b.weight);
    const mst: Edge[] = [];
    let totalWeight = 0;
  
    for (const edge of formattedEdges) {
     
    
        mst.push(edge);
        totalWeight += edge.weight;
        steps.push([...mst]);
      
    }
  
    return {
      mst,
      totalWeight,
      steps,
    };
  };
  