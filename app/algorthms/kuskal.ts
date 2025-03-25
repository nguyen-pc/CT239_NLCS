interface Edge {
  source: number;
  target: number;
  weight: number;
}

function find(parent: number[], i: number): number {
  if (parent[i] === i) return i;
  return (parent[i] = find(parent, parent[i]));
}

function union(parent: number[], rank: number[], x: number, y: number) {
  const xRoot = find(parent, x);
  const yRoot = find(parent, y);

  if (rank[xRoot] < rank[yRoot]) {
    parent[xRoot] = yRoot;
  } else if (rank[xRoot] > rank[yRoot]) {
    parent[yRoot] = xRoot;
  } else {
    parent[yRoot] = xRoot;
    rank[xRoot]++;
  }
}

export function kruskal(edges: Edge[], vertexCount: number, begin: number) {
  console.log(vertexCount, begin);
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  const parent = Array.from({ length: vertexCount }, (_, i) => i);
  const rank = new Array(vertexCount).fill(0);
  const mst: Edge[] = [];

  for (const edge of sortedEdges) {
    const sourceRoot = find(parent, edge.source);
    const targetRoot = find(parent, edge.target);

    if (sourceRoot !== targetRoot) {
      mst.push(edge);
      union(parent, rank, sourceRoot, targetRoot);
    }
  }

  return {
    mst,
    totalWeight: mst.reduce((sum, edge) => sum + edge.weight, 0),
  };
}
