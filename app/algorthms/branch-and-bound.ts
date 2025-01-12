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

  // Call the lower bound

  function calculateBound(
    path: number[],
    visited: Set<number>,
    currentCost: number
  ): number {
    let bound = currentCost;

    // Add the minium outgoing
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
    const nodeId = `${path.join("->")}`; // Unique identifier for this state

    // Compute the lower bound for the current path
    const bound = calculateBound(path, visited, currentCost);

    // Add the current node
    const node = {
      id: nodeId,
      node: currentNode,
      path: [...path],
      bound,
      cost: currentCost,
      pruned: false,
      isLeaf: path.length === n + 1,
    };

    //    prune the branch if its bound exceed the best known cost
    if (bound >= bestCost) {
      node.pruned = true;
      resultNodes.push(node); // Add pruned node to result
      return;
    }

    // Add the current node to result node
    resultNodes.push(node);

    // if visited all node and returned to start node
    if (path.length === n) {
      const returnCost = graph[currentNode][startNode];
      const totalCost = currentCost + returnCost;

      // update best solution
      if (totalCost < bestCost) {
        bestCost = totalCost;
        bestPath = [...path, startNode];
      }
      // Add the return edge to the result edge
      const childId = `${path.join("->")}->${startNode}`;
      resultEdges.push({
        from: nodeId,
        to: childId,
        cost: returnCost,
      });
      // Add the return node
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
    // Explore all unvisited nodes
    for (let nextNode = 0; nextNode < n; nextNode++) {
      if (!visited.has(nextNode) && graph[currentNode][nextNode] !== 0) {
        const newVisited = new Set(visited);
        newVisited.add(nextNode);
        const newPath = [...path, nextNode];
        const newCost = currentCost + graph[currentNode][nextNode];

        const childId = `${newPath.join("->")}`;

        // Add the edge to the edges array
        resultEdges.push({
          from: nodeId,
          to: childId,
          cost: graph[currentNode][nextNode],
        });

        // Recursively build the tree for the child
        branchAndBound(newPath, newVisited, newCost);
      }
    }
  }

  // Start building the tree from the starting node
  const visited = new Set<number>();
  visited.add(startNode);
  branchAndBound([startNode], visited, 0);

  return { resultNodes, resultEdges, bestCost, bestPath };
}
