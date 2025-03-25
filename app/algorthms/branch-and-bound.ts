interface Edge {
  source: number;
  target: number;
  weight: number;
}

export function branchAndBoundTSP(
  edges: Edge[],
  vertexCount: number,
  startNode: number = 0
) {
  // Tạo ma trận kề với kích thước chính xác
  const graph: number[][] = [];
  for (let i = 0; i <= vertexCount; i++) {
    graph[i] = new Array(vertexCount + 1).fill(0);
  }

  // Dien thong tin vao ma tran ke
  edges.forEach((edge) => {
    if (edge.source <= vertexCount && edge.target <= vertexCount) {
      graph[edge.source][edge.target] = edge.weight;
      // graph[edge.target][edge.source] = edge.weight;   //Do thi co huong
    }
  });

  const n = vertexCount;

  const resultNodes: any[] = [];
  const resultEdges: any[] = [];

  let bestCost = Infinity;
  let bestPath = null;

  function calculateBound(
    path: number[],
    visited: Set<number>,
    currentCost: number
  ): number {
    let bound = currentCost;

    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        let minEdgeCost = Infinity;
        for (let j = 0; j < n; j++) {
          if (i !== j && !visited.has(j) && graph[i][j] !== 0) {
            minEdgeCost = Math.min(minEdgeCost, graph[i][j]);
          }
        }
        bound += minEdgeCost === Infinity ? 0 : minEdgeCost;
      }
    }
    return bound;
  }

  function branchAndBound(
    path: number[],
    visited: Set<number>,
    currentCost: number
  ) {
    const currentNode = path[path.length - 1];
    const nodeId = `${path.join("->")}`;

    const bound = calculateBound(path, visited, currentCost);

    const node = {
      id: nodeId,
      node: currentNode,
      path: [...path],
      bound,
      cost: currentCost,
      pruned: false,
      isLeaf: path.length === n + 1,
    };

    if (bound >= bestCost) {
      node.pruned = true;
      resultNodes.push(node);
      return;
    }

    resultNodes.push(node);

    if (path.length === n) {
      const returnCost = graph[currentNode][startNode];
      const totalCost = currentCost + returnCost;

      if (totalCost < bestCost) {
        bestCost = totalCost;
        bestPath = [...path, startNode];
      }

      const childId = `${path.join("->")}->${startNode}`;
      resultEdges.push({
        from: nodeId,
        to: childId,
        cost: returnCost,
      });

      resultNodes.push({
        id: childId,
        node: startNode,
        path: [...path, startNode],
        cost: totalCost,
        bound: 0,
        pruned: false,
        isLeaf: true,
      });
      return;
    }

    for (let nextNode = 0; nextNode < n; nextNode++) {
      if (!visited.has(nextNode) && graph[currentNode][nextNode] !== 0) {
        const newVisited = new Set(visited);
        newVisited.add(nextNode);
        const newPath = [...path, nextNode];
        const newCost = currentCost + graph[currentNode][nextNode];

        const childId = `${newPath.join("->")}`;

        resultEdges.push({
          from: nodeId,
          to: childId,
          cost: graph[currentNode][nextNode],
        });

        branchAndBound(newPath, newVisited, newCost);
      }
    }
  }

  const visited = new Set<number>();
  visited.add(startNode);
  branchAndBound([startNode], visited, 0);

  return { resultNodes, resultEdges, bestCost, bestPath };
}
